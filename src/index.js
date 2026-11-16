/**
 * Sunday At Church — private, resumable R2 upload API.
 *
 * Upload flow:
 * 1. POST /api/submissions/init (validates participant details + Turnstile).
 * 2. PUT /api/submissions/{id}/answers/{question} (one video per request).
 * 3. POST /api/submissions/{id}/finalize (checks every R2 object before confirmation).
 *
 * The bucket must remain private. The temporary upload token is stored only in
 * a private R2 session object and is never written to public website files.
 */
const MAX_FILE_BYTES = 40 * 1024 * 1024;
const MAX_TOTAL_BYTES = 200 * 1024 * 1024;
const MAX_FILES = 20;
const SESSION_TTL_MS = 48 * 60 * 60 * 1000;

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
}
function corsHeaders(origin, env) {
  const headers = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
  if (origin && allowedOrigins(env).includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}
function json(data, status, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin, env) }
  });
}
function isAdult(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const dob = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(dob.getTime()) || dob.toISOString().slice(0, 10) !== value) return false;
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  if (now.getUTCMonth() < dob.getUTCMonth() ||
      (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate())) age--;
  return age >= 18;
}
function safeExtension(type) {
  const normalized = String(type || "").toLowerCase().split(";")[0].trim();
  if (normalized === "video/webm") return "webm";
  if (normalized === "video/mp4") return "mp4";
  return null;
}
async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY || !token) return false;
  const body = new URLSearchParams();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", body
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}
function bearer(request) {
  const value = request.headers.get("Authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}
function sessionKey(id) { return `pending/${id}/session.json`; }
function answerKey(id, number, ext) {
  return `pending/${id}/answers/question-${String(number).padStart(2, "0")}.${ext}`;
}
async function readSession(env, id, request) {
  const token = bearer(request);
  if (!token) return null;
  const object = await env.BUCKET.get(sessionKey(id));
  if (!object) return null;
  const session = await object.json();
  if (session.uploadToken !== token || Date.now() > session.expiresAt) return null;
  return session;
}
async function handleInit(request, env, origin) {
  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Invalid submission details." }, 400, origin, env); }

  if (!(await verifyTurnstile(String(data.turnstileToken || ""), request, env))) {
    return json({ error: "Security check failed. Please verify again." }, 403, origin, env);
  }

  const legalName = String(data.legalName || "").trim();
  const email = String(data.email || "").trim();
  const dob = String(data.dob || "").trim();
  const consent = data.consent === true;
  const adobeReleaseDeclared = data.adobeReleaseDeclared === true;
  const credit = String(data.credit || "");
  const preferredName = String(data.preferredName || "").trim();
  const language = data.language === "es" ? "es" : "en";
  const answers = Array.isArray(data.answers)
    ? [...new Set(data.answers.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= MAX_FILES))].sort((a,b) => a-b)
    : [];

  if (!legalName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !isAdult(dob) || !consent || !adobeReleaseDeclared) {
    return json({ error: "Required participant details, age declaration, Adobe release declaration or consent are missing." }, 400, origin, env);
  }
  if (!["full", "preferred", "none"].includes(credit)) {
    return json({ error: "Invalid credit preference." }, 400, origin, env);
  }
  if (credit === "preferred" && !preferredName) {
    return json({ error: "Please provide the preferred credit name." }, 400, origin, env);
  }
  if (!answers.length) return json({ error: "No answer clips were selected." }, 400, origin, env);

  const submissionId = `SAC-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const uploadToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
  const createdAt = new Date().toISOString();
  const session = {
    submissionId, uploadToken, createdAt, expiresAt: Date.now() + SESSION_TTL_MS,
    expectedAnswers: answers,
    participant: { legalName, email, dob, credit, preferredName: credit === "preferred" ? preferredName : "" },
    language, consentRecorded: consent, participantDeclaredAdobeReleaseCompleted: adobeReleaseDeclared
  };
  await env.BUCKET.put(sessionKey(submissionId), JSON.stringify(session), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { submissionId, purpose: "temporary-upload-session" }
  });
  return json({ ok: true, submissionId, uploadToken, expectedAnswers: answers }, 201, origin, env);
}
async function handleAnswer(request, env, origin, id, number) {
  const session = await readSession(env, id, request);
  if (!session) return json({ error: "Upload session expired or invalid. Please restart the submission." }, 401, origin, env);
  if (session.finalizedAt) return json({ error: "This submission has already been finalized." }, 409, origin, env);
  if (!session.expectedAnswers.includes(number)) return json({ error: "This answer was not included in the submission." }, 400, origin, env);

  const ext = safeExtension(request.headers.get("Content-Type"));
  if (!ext) return json({ error: "Only WebM or MP4 video is accepted." }, 415, origin, env);
  const contentLengthHeader = request.headers.get("Content-Length");
  const declaredLength = contentLengthHeader === null ? null : Number(contentLengthHeader);
  if (declaredLength !== null && (!Number.isSafeInteger(declaredLength) || declaredLength <= 0)) {
    return json({ error: "A valid Content-Length header is required for this video." }, 411, origin, env);
  }
  if (declaredLength !== null && declaredLength > MAX_FILE_BYTES) {
    return json({ error: "This video exceeds the 40 MB limit." }, 413, origin, env);
  }
  if (!request.body) return json({ error: "The video body is empty." }, 400, origin, env);

  const existingTotal = Number(session.totalBytes || 0);
  const previous = session.uploaded?.[String(number)];
  const previousSize = Number(previous?.size || 0);
  if (declaredLength !== null && existingTotal - previousSize + declaredLength > MAX_TOTAL_BYTES) {
    return json({ error: "The combined videos exceed the 200 MB limit." }, 413, origin, env);
  }

  // R2 requires a stream with a known length. Do not pipe a known-length request
  // through TransformStream: that strips the length metadata and makes R2.put fail.
  // Browser Blob uploads include Content-Length, so pass that original request body
  // directly to R2. If a client omits Content-Length, buffer only this bounded
  // single answer (maximum 40 MB) and enforce both limits while reading it.
  let uploadBody = request.body;
  let bytesSeen = 0;
  if (declaredLength === null) {
    const reader = request.body.getReader();
    const chunks = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesSeen += value.byteLength;
        if (bytesSeen > MAX_FILE_BYTES) {
          await reader.cancel();
          return json({ error: "This video exceeds the 40 MB limit." }, 413, origin, env);
        }
        if (existingTotal - previousSize + bytesSeen > MAX_TOTAL_BYTES) {
          await reader.cancel();
          return json({ error: "The combined videos exceed the 200 MB limit." }, 413, origin, env);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    if (!bytesSeen) return json({ error: "The video body is empty." }, 400, origin, env);
    const buffered = new Uint8Array(bytesSeen);
    let offset = 0;
    for (const chunk of chunks) { buffered.set(chunk, offset); offset += chunk.byteLength; }
    uploadBody = buffered;
  } else {
    bytesSeen = declaredLength;
  }

  const key = answerKey(id, number, ext);
  try {
    await env.BUCKET.put(key, uploadBody, {
      httpMetadata: { contentType: `video/${ext}` },
      customMetadata: { submissionId: id, createdAt: session.createdAt, questionNumber: String(number) }
    });
  } catch (error) {
    // Log the technical cause without logging participant data or the bearer token.
    console.error("R2 answer upload failed", {
      submissionId: id, question: number,
      error: error instanceof Error ? error.message : String(error)
    });
    const tooLarge = /40 MB|200 MB/.test(String(error));
    return json({ error: tooLarge ? "The video or combined submission exceeds the allowed size." : "The upload could not be stored. Please retry this answer." }, tooLarge ? 413 : 500, origin, env);
  }
  const head = await env.BUCKET.head(key);
  if (!head || head.size !== bytesSeen) return json({ error: "The uploaded video could not be verified in storage. Please retry this answer." }, 500, origin, env);

  session.uploaded = session.uploaded || {};
  // Remove an older extension if the participant retries with a different supported format.
  if (previous?.key && previous.key !== key) await env.BUCKET.delete(previous.key);
  session.uploaded[String(number)] = { key, size: head.size, type: `video/${ext}` };
  session.totalBytes = existingTotal - previousSize + head.size;
  await env.BUCKET.put(sessionKey(id), JSON.stringify(session), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { submissionId: id, purpose: "temporary-upload-session" }
  });
  return json({ ok: true, question: number, size: head.size, stored: true }, 200, origin, env);
}
async function handleFinalize(request, env, origin, id) {
  const session = await readSession(env, id, request);
  if (!session) return json({ error: "Upload session expired or invalid. Please restart the submission." }, 401, origin, env);
  const uploaded = session.uploaded || {};
  const missing = session.expectedAnswers.filter(n => !uploaded[String(n)]);
  if (missing.length) return json({ error: `Some answers are still missing: ${missing.join(", ")}. Retry them before finishing.`, missing }, 409, origin, env);

  const files = [];
  for (const n of session.expectedAnswers) {
    const item = uploaded[String(n)];
    const stagedHead = await env.BUCKET.head(item.key);
    if (!stagedHead || stagedHead.size !== item.size) return json({ error: `Answer ${n} could not be verified in temporary storage. Please retry it.` }, 500, origin, env);
    const finalKey = `submissions/${id}/question-${String(n).padStart(2, "0")}.${item.type === "video/mp4" ? "mp4" : "webm"}`;
    // Copy from the private staging prefix into the permanent submission prefix only at finalization.
    if (!(await env.BUCKET.head(finalKey))) {
      const stagedObject = await env.BUCKET.get(item.key);
      if (!stagedObject) return json({ error: `Answer ${n} is no longer available. Please retry it.` }, 500, origin, env);
      await env.BUCKET.put(finalKey, stagedObject.body, {
        httpMetadata: { contentType: item.type },
        customMetadata: { submissionId: id, createdAt: session.createdAt, questionNumber: String(n) }
      });
    }
    const finalHead = await env.BUCKET.head(finalKey);
    if (!finalHead || finalHead.size !== item.size) return json({ error: `Answer ${n} could not be verified in final storage. Please retry it.` }, 500, origin, env);
    files.push({ question: n, key: finalKey, size: finalHead.size, type: item.type });
  }

  const metadata = {
    submissionId: id,
    createdAt: session.createdAt,
    receivedAt: new Date().toISOString(),
    submissionStatus: "awaiting_manual_verification",
    releaseStatus: "awaiting_manual_verification",
    footageStatus: "received_pending_review",
    participant: session.participant,
    language: session.language,
    participantDeclaredAdobeReleaseCompleted: session.participantDeclaredAdobeReleaseCompleted,
    consentRecorded: session.consentRecorded,
    manualReview: {
      signedPdfVerified: false, footageVerified: false,
      ssdArchiveVerified: false, r2DeletionVerified: false
    },
    files: files.map(({ question, size, type }) => ({ question, size, type }))
  };
  await env.BUCKET.put(`submissions/${id}/submission.json`, JSON.stringify(metadata, null, 2), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { submissionId: id, createdAt: session.createdAt }
  });
  const metadataHead = await env.BUCKET.head(`submissions/${id}/submission.json`);
  if (!metadataHead) return json({ error: "The final submission record could not be verified. Please contact the filmmaker before closing this page." }, 500, origin, env);

  // Keep the private session until its 48-hour expiry. This makes finalization idempotent:
  // if the response is lost, the browser can retry and receive confirmation again.
  session.finalizedAt = session.finalizedAt || new Date().toISOString();
  await env.BUCKET.put(sessionKey(id), JSON.stringify(session), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { submissionId: id, purpose: "temporary-upload-session" }
  });
  return json({
    ok: true, submissionId: id, status: "awaiting_manual_verification",
    verifiedAnswers: session.expectedAnswers,
    message: "All selected videos and the submission record have been stored and verified."
  }, 201, origin, env);
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS") {
      if (origin && !allowedOrigins(env).includes(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }
    if (origin && !allowedOrigins(env).includes(origin)) return json({ error: "Origin not allowed." }, 403, origin, env);
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "Sunday At Church upload API", submissionsEnabled: env.ENABLE_SUBMISSIONS === "true" }, 200, origin, env);
    }
    if (env.ENABLE_SUBMISSIONS !== "true") return json({ error: "Submissions are not enabled." }, 503, origin, env);
    if (!env.BUCKET) return json({ error: "Private storage is not configured." }, 503, origin, env);

    if (url.pathname === "/api/submissions/init" && request.method === "POST") {
      return handleInit(request, env, origin);
    }
    const answerMatch = url.pathname.match(/^\/api\/submissions\/(SAC-[A-F0-9]{8})\/answers\/(\d{1,2})$/);
    if (answerMatch && request.method === "PUT") {
      return handleAnswer(request, env, origin, answerMatch[1], Number(answerMatch[2]));
    }
    const finalMatch = url.pathname.match(/^\/api\/submissions\/(SAC-[A-F0-9]{8})\/finalize$/);
    if (finalMatch && request.method === "POST") {
      return handleFinalize(request, env, origin, finalMatch[1]);
    }
    return json({ error: "Not found." }, 404, origin, env);
  }
};
