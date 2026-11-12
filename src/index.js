/**
 * Sunday At Church — private Cloudflare R2 upload API.
 * Submissions are deliberately marked pending manual verification.
 * No public bucket listing or download endpoint is exposed.
 */
const MAX_FILE_BYTES = 40 * 1024 * 1024;
const MAX_TOTAL_BYTES = 200 * 1024 * 1024;
const MAX_FILES = 20;

function allowedOrigins(env){return (env.ALLOWED_ORIGINS||"").split(",").map(s=>s.trim()).filter(Boolean);}
function corsHeaders(origin,env){const allowed=allowedOrigins(env);const h={"Vary":"Origin","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400"};if(origin&&allowed.includes(origin))h["Access-Control-Allow-Origin"]=origin;return h;}
function json(data,status,origin,env){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8",...corsHeaders(origin,env)}});}
async function verifyTurnstile(token,request,env){
  if(!env.TURNSTILE_SECRET_KEY||!token)return false;
  const body=new URLSearchParams();body.set("secret",env.TURNSTILE_SECRET_KEY);body.set("response",token);
  const ip=request.headers.get("CF-Connecting-IP");if(ip)body.set("remoteip",ip);
  const response=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body});
  if(!response.ok)return false;const result=await response.json();return result.success===true;
}
function safeExtension(type){const n=String(type||"").toLowerCase().split(";")[0].trim();if(n==="video/webm")return "webm";if(n==="video/mp4")return "mp4";return null;}
function isAdult(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const dob=new Date(`${value}T00:00:00Z`);if(Number.isNaN(dob.getTime())||dob.toISOString().slice(0,10)!==value)return false;
  const now=new Date();let age=now.getUTCFullYear()-dob.getUTCFullYear();
  if(now.getUTCMonth()<dob.getUTCMonth()||(now.getUTCMonth()===dob.getUTCMonth()&&now.getUTCDate()<dob.getUTCDate()))age--;
  return age>=18;
}
export default {
  async fetch(request,env){
    const url=new URL(request.url),origin=request.headers.get("Origin");
    if(request.method==="OPTIONS"){if(origin&&!allowedOrigins(env).includes(origin))return new Response(null,{status:403});return new Response(null,{status:204,headers:corsHeaders(origin,env)});}
    if(origin&&!allowedOrigins(env).includes(origin))return json({error:"Origen no permitido."},403,origin,env);
    if(url.pathname==="/api/health"&&request.method==="GET")return json({ok:true,service:"API de envíos de Sunday At Church",submissionsEnabled:env.ENABLE_SUBMISSIONS==="true"},200,origin,env);
    if(url.pathname!=="/api/submissions"||request.method!=="POST")return json({error:"No encontrado."},404,origin,env);
    if(env.ENABLE_SUBMISSIONS!=="true")return json({error:"Los envíos no están habilitados."},503,origin,env);
    if(!env.BUCKET)return json({error:"El almacenamiento privado no está configurado."},503,origin,env);
    const length=Number(request.headers.get("Content-Length")||"0");if(length>MAX_TOTAL_BYTES+2*1024*1024)return json({error:"El envío supera el tamaño permitido."},413,origin,env);
    let form;try{form=await request.formData();}catch{return json({error:"Se esperaban datos de formulario multiparte."},400,origin,env);}
    if(!(await verifyTurnstile(String(form.get("turnstileToken")||""),request,env)))return json({error:"La verificación de seguridad ha fallado. Inténtalo de nuevo."},403,origin,env);
    const legalName=String(form.get("legalName")||"").trim(),email=String(form.get("email")||"").trim(),dob=String(form.get("dob")||"").trim();
    const consent=String(form.get("consent")||"")==="true",adobeReleaseDeclared=String(form.get("adobeReleaseDeclared")||"")==="true";
    const credit=String(form.get("credit")||"").trim(),preferredName=String(form.get("preferredName")||"").trim(),language=String(form.get("language")||"en");
    if(!legalName||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!isAdult(dob)||!consent||!adobeReleaseDeclared)return json({error:"Faltan datos obligatorios, la declaración de mayoría de edad, la declaración de autorización de Adobe o el consentimiento."},400,origin,env);
    if(!["full","preferred","none"].includes(credit))return json({error:"La opción de créditos no es válida."},400,origin,env);
    if(credit==="preferred"&&!preferredName)return json({error:"Indica el nombre que quieres utilizar en los créditos."},400,origin,env);
    const files=[];let total=0;
    for(let i=0;i<MAX_FILES;i++){const item=form.get(`answer${i+1}`);if(item instanceof File&&item.size>0){const ext=safeExtension(item.type);if(!ext)return json({error:`Answer ${i+1} debe ser un vídeo WebM o MP4.`},415,origin,env);if(item.size>MAX_FILE_BYTES)return json({error:`Answer ${i+1} supera el límite de 40 MB.`},413,origin,env);total+=item.size;files.push({index:i+1,file:item,ext});}}
    if(!files.length)return json({error:"No se han adjuntado vídeos de respuestas."},400,origin,env);
    if(total>MAX_TOTAL_BYTES)return json({error:"El conjunto de vídeos supera el límite de 200 MB."},413,origin,env);
    const submissionId=`SAC-${crypto.randomUUID().replaceAll("-","").slice(0,8).toUpperCase()}`;
    const prefix=`submissions/${submissionId}/`,createdAt=new Date().toISOString();
    try{
      for(const entry of files){const key=`${prefix}question-${String(entry.index).padStart(2,"0")}.${entry.ext}`;await env.BUCKET.put(key,entry.file.stream(),{httpMetadata:{contentType:entry.file.type},customMetadata:{submissionId,createdAt,questionNumber:String(entry.index)}});}
      const metadata={submissionId,createdAt,submissionStatus:"awaiting_manual_verification",releaseStatus:"awaiting_manual_verification",footageStatus:"received_pending_review",participant:{legalName,email,dob,credit,preferredName:credit==="preferred"?preferredName:""},language,participantDeclaredAdobeReleaseCompleted:adobeReleaseDeclared,consentRecorded:consent,manualReview:{signedPdfVerified:false,footageVerified:false,ssdArchiveVerified:false,r2DeletionVerified:false},files:files.map(f=>({question:f.index,size:f.file.size,type:f.file.type}))};
      await env.BUCKET.put(`${prefix}submission.json`,JSON.stringify(metadata,null,2),{httpMetadata:{contentType:"application/json"},customMetadata:{submissionId,createdAt}});
    }catch(error){return json({error:"Ha fallado el almacenamiento. Ponte en contacto con el cineasta; no se puede confirmar el envío."},500,origin,env);}
    return json({ok:true,submissionId,status:"awaiting_manual_verification",message:"Hemos recibido tus archivos y están pendientes de verificación manual."},201,origin,env);
  }
};
