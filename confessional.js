const qs=questions;
let index=0,stream=null,recorder=null,chunks=[],clips={},turnstileToken="",turnstileWidgetId=null;
const $=id=>document.getElementById(id);
const API_BASE="https://sundayatchurch-api.hi-d37.workers.dev";
const TURNSTILE_SITE_KEY="0x4AAAAAAF-g4KWyfvHl1wnb";

function setQuestionLanguage(language){
  $("question").textContent=qs[language][index];
  $("questionNumber").textContent=String(index+1).padStart(2,"0")+" / 08";
}
window.setQuestionLanguage=setQuestionLanguage;
function status(msg){$("status").textContent=msg}
function uploadStatus(msg){$("uploadStatus").textContent=msg}
function adultFromDate(dateString){
  if(!dateString)return false;
  const dob=new Date(dateString+"T00:00:00");
  if(Number.isNaN(dob.getTime()))return false;
  const today=new Date();
  let age=today.getFullYear()-dob.getFullYear();
  const beforeBirthday=today.getMonth()<dob.getMonth() ||
    (today.getMonth()===dob.getMonth() && today.getDate()<dob.getDate());
  if(beforeBirthday)age--;
  return age>=18;
}
function refreshSubmitState(){
  const hasClips=Object.keys(clips).length>0;
  $("submitBtn").disabled=!(hasClips && turnstileToken);
}
window.onTurnstileLoad=function(){
  if(!window.turnstile || turnstileWidgetId!==null)return;
  turnstileWidgetId=window.turnstile.render("#turnstileWidget",{
    sitekey:TURNSTILE_SITE_KEY,
    callback:(token)=>{turnstileToken=token;refreshSubmitState();uploadStatus("");},
    "expired-callback":()=>{turnstileToken="";refreshSubmitState();uploadStatus(lang==="es"?"La verificación ha caducado. Vuelve a verificarte.":"Verification expired. Please verify again.");},
    "error-callback":()=>{turnstileToken="";refreshSubmitState();uploadStatus(lang==="es"?"No se pudo completar la verificación.":"Verification could not be completed.");}
  });
};

$("cameraBtn").addEventListener("click",async()=>{
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    $("preview").srcObject=stream;
    $("recordBtn").disabled=false;
    status(lang==="es"?"Cámara y micrófono preparados.":"Camera and microphone ready.");
  }catch(e){
    status(lang==="es"?"No se pudo acceder a la cámara o al micrófono. Comprueba los permisos del navegador.":"Could not access camera or microphone. Check browser permissions.");
  }
});
$("recordBtn").addEventListener("click",()=>{
  if(!$("agree").checked||!$("adobeReleaseCompleted").checked||!$("legalName").value.trim()){
    status(lang==="es"?"Completa tus datos, firma la autorización de Adobe Sign y marca la casilla de confirmación.":"Complete your details, sign the Adobe release and tick the confirmation box.");
    return;
  }
  if(!adultFromDate($("dob").value)){
    status(lang==="es"?"Debes tener 18 años o más para participar.":"You must be 18 or older to participate.");
    return;
  }
  if(!stream)return;
  chunks=[];
  recorder=new MediaRecorder(stream);
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onstop=()=>{
    const mime=(recorder.mimeType||"video/webm").split(";")[0];
    clips[index]=new Blob(chunks,{type:mime});
    renderDownloads();
    refreshSubmitState();
    status(lang==="es"?"Vídeo guardado en esta sesión del navegador.":"Clip saved locally in this browser session.");
  };
  recorder.start();
  $("recordBtn").disabled=true;
  $("stopBtn").disabled=false;
  status(lang==="es"?"Grabando…":"Recording…");
});
$("stopBtn").addEventListener("click",()=>{
  if(recorder&&recorder.state!=="inactive"){
    recorder.stop();
    $("recordBtn").disabled=false;
    $("stopBtn").disabled=true;
  }
});
$("prevBtn").addEventListener("click",()=>{
  index=Math.max(0,index-1);
  setQuestionLanguage(lang);
});
$("nextBtn").addEventListener("click",()=>{
  index=Math.min(7,index+1);
  setQuestionLanguage(lang);
});
function renderDownloads(){
  const d=$("downloads");
  d.innerHTML="";
  Object.keys(clips).sort((a,b)=>a-b).forEach(k=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(clips[k]);
    a.download=`sunday-at-church-answer-${Number(k)+1}.webm`;
    a.textContent=`DOWNLOAD ANSWER ${Number(k)+1} ↓`;
    d.appendChild(a);
  });
}
$("credit").addEventListener("change",()=>{
  $("preferredWrap").style.display=$("credit").value==="preferred"?"flex":"none";
});
$("preferredWrap").style.display="none";

$("submitBtn").addEventListener("click",async()=>{
  uploadStatus("");
  const legalName=$("legalName").value.trim();
  const email=$("email").value.trim();
  const dob=$("dob").value;
  const credit=$("credit").value;
  const preferredName=$("preferredName").value.trim();

  if(!legalName||!email||!dob||!$("agree").checked||!$("adobeReleaseCompleted").checked){
    uploadStatus(lang==="es"?"Revisa los datos obligatorios, la declaración y la confirmación de Adobe Sign.":"Please check the required details, declaration and Adobe Sign confirmation.");
    return;
  }
  if(!adultFromDate(dob)){
    uploadStatus(lang==="es"?"Debes tener 18 años o más.":"You must be 18 or older.");
    return;
  }
  if(credit==="preferred"&&!preferredName){
    uploadStatus(lang==="es"?"Indica el nombre que quieres utilizar en los créditos.":"Please enter the name you want used in the credits.");
    return;
  }
  if(!turnstileToken){
    uploadStatus(lang==="es"?"Completa la verificación de seguridad.":"Complete the security verification.");
    return;
  }
  if(!Object.keys(clips).length){
    uploadStatus(lang==="es"?"Graba al menos una respuesta antes de enviar.":"Record at least one answer before submitting.");
    return;
  }

  const data=new FormData();
  data.set("legalName",legalName);
  data.set("email",email);
  data.set("dob",dob);
  data.set("adobeReleaseCompleted","true");
  data.set("consent","true");
  data.set("credit",credit);
  data.set("preferredName",preferredName);
  data.set("turnstileToken",turnstileToken);
  Object.keys(clips).forEach(k=>{
    const blob=clips[k];
    const ext=blob.type==="video/mp4"?"mp4":"webm";
    data.set(`answer${Number(k)+1}`,blob,`answer-${Number(k)+1}.${ext}`);
  });

  $("submitBtn").disabled=true;
  uploadStatus(lang==="es"?"Comprobando el estado del sistema…":"Checking submission service…");
  try{
    const response=await fetch(`${API_BASE}/api/submissions`,{method:"POST",body:data});
    const result=await response.json().catch(()=>({}));
    if(response.status===503){
      uploadStatus(lang==="es"?"El sistema todavía no acepta participaciones. No se ha enviado ni guardado ningún vídeo.":"The system is not accepting submissions yet. No video has been accepted or stored.");
      return;
    }
    if(!response.ok){
      uploadStatus(result.error||(lang==="es"?"No se pudo enviar. Inténtalo más tarde.":"Submission failed. Please try again later."));
      if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
      turnstileToken="";
      return;
    }
    uploadStatus((lang==="es"?"Envío recibido. Tu código es: ":"Submission received. Your reference is: ")+result.submissionId+(lang==="es"?". La autorización y los vídeos quedan pendientes de comprobación manual.":". Your release and footage are now awaiting manual verification."));
  }catch(e){
    uploadStatus(lang==="es"?"No se pudo conectar con el servidor. Tus vídeos siguen en este navegador.":"Could not connect to the server. Your clips remain in this browser.");
  }finally{
    refreshSubmitState();
  }
});

window.addEventListener("beforeunload",()=>{
  if(stream)stream.getTracks().forEach(t=>t.stop());
});
