    /**
 * Sunday At Church — private R2 upload API scaffold
 *
 * This Worker deliberately refuses submissions until the owner has:
 * 1) configured the allowed origin,
 * 2) configured Cloudflare Turnstile,
 * 3) explicitly enabled submissions with ENABLE_SUBMISSIONS="true".
 *
 * No public bucket access, listing, or download route is provided.
 */
const MAX_FILE_BYTES = 40 * 1024 * 1024; // 40 MB per answer clip
const MAX_TOTAL_BYTES = 200 * 1024 * 1024; // 200 MB per submission
const MAX_FILES = 8;

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin, env) {
  const allowed = allowedOrigins(env);
  const headers = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  if (origin && allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(data, status, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin, env) }
  });
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY || !token) return false;
  const body = new URLSearchParams();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

function safeExtension(type) {
  if (type === "video/webm") return "webm";
  if (type === "video/mp4") return "mp4";
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      if (origin && !allowedOrigins(env).includes(origin)) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (origin && !allowedOrigins(env).includes(origin)) {
      return json({ error: "Origin not allowed." }, 403, origin, env);
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "Sunday At Church upload API", submissionsEnabled: env.ENABLE_SUBMISSIONS === "true" }, 200, origin, env);
    }

    if (url.pathname !== "/api/submissions" || request.method !== "POST") {
      return json({ error: "Not found." }, 404, origin, env);
    }

    if (env.ENABLE_SUBMISSIONS !== "true") {
      return json({ error: "Submissions are not enabled yet. Please do not submit real recordings." }, 503, origin, env);
    }

    if (!env.BUCKET) {
      return json({ error: "Private storage is not configured." }, 503, origin, env);
    }

    const contentLength = Number(request.headers.get("Content-Length") || "0");
    if (contentLength > MAX_TOTAL_BYTES + 2 * 1024 * 1024) {
      return json({ error: "Submission is too large." }, 413, origin, env);
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ error: "Expected multipart form data." }, 400, origin, env);
    }

    const turnstileToken = String(form.get("turnstileToken") || "");
    if (!(await verifyTurnstile(turnstileToken, request, env))) {
      return json({ error: "Security check failed. Please try again." }, 403, origin, env);
    }

    const legalName = String(form.get("legalName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const dob = String(form.get("dob") || "").trim();
    const signature = String(form.get("signature") || "").trim();
    const consent = String(form.get("consent") || "") === "true";
    const credit = String(form.get("credit") || "").trim();
    const preferredName = String(form.get("preferredName") || "").trim();

    if (!legalName || !email || !dob || signature !== legalName || !consent) {
      return json({ error: "Required participant details or consent are missing." }, 400, origin, env);
    }
    if (!["full", "preferred", "none"].includes(credit)) {
      return json({ error: "Invalid credit preference." }, 400, origin, env);
    }
    if (credit === "preferred" && !preferredName) {
      return json({ error: "Please provide the preferred credit name." }, 400, origin, env);
    }

    const files = [];
    let totalBytes = 0;
    for (let i = 0; i < MAX_FILES; i++) {
      const item = form.get(`answer${i + 1}`);
      if (item instanceof File && item.size > 0) {
        const ext = safeExtension(item.type);
        if (!ext) return json({ error: `Answer ${i + 1} must be a WebM or MP4 video.` }, 415, origin, env);
        if (item.size > MAX_FILE_BYTES) return json({ error: `Answer ${i + 1} exceeds the 40 MB limit.` }, 413, origin, env);
        totalBytes += item.size;
        files.push({ index: i + 1, file: item, ext });
      }
    }
    if (!files.length) return json({ error: "No answer clips were attached." }, 400, origin, env);
    if (totalBytes > MAX_TOTAL_BYTES) return json({ error: "The combined clips exceed the 200 MB limit." }, 413, origin, env);

    const submissionId = `SAC-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
    const prefix = `submissions/${submissionId}/`;
    const createdAt = new Date().toISOString();

    try {
      for (const entry of files) {
        const key = `${prefix}answer-${String(entry.index).padStart(2, "0")}.${entry.ext}`;
        await env.BUCKET.put(key, entry.file.stream(), {
          httpMetadata: { contentType: entry.file.type },
          customMetadata: { submissionId, createdAt, answerNumber: String(entry.index) }
        });
      }

      // Keep identifying data in a separate private object. No public read/list endpoint exists.
      const metadata = {
        submissionId,
        createdAt,
        participant: { legalName, email, dob, credit, preferredName: credit === "preferred" ? preferredName : "" },
        consentRecorded: consent,
        signatureTyped: true,
        files: files.map((f) => ({ answer: f.index, size: f.file.size, type: f.file.type }))
      };
      await env.BUCKET.put(`${prefix}submission.json`, JSON.stringify(metadata, null, 2), {
        httpMetadata: { contentType: "application/json" },
        customMetadata: { submissionId, createdAt }
      });
    } catch (error) {
      return json({ error: "Storage failed. Please contact the filmmaker; no confirmation can be issued." }, 500, origin, env);
    }

    return json({ ok: true, submissionId, message: "Your files have been received." }, 201, origin, env);
  }
};
