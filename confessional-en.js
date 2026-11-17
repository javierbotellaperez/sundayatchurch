const $ = (id) => document.getElementById(id);
const API_BASE = "https://sundayatchurch-api.hi-d37.workers.dev";
const TURNSTILE_SITE_KEY = "0x4AAAAAAF-g4KWyfvHl1wnb";

const questionBank = { en: [
    {section:"THE CONFESSION", type:"core", text:"Forgive me, Father, for I've sinned. The last time I went to a sauna was…", hint:"Say how long ago it was. It could have been yesterday, five years ago, or your first and last visit."},
    {section:"THE FIRST TIME", type:"core", text:"What did you expect to find the first time you went to a sauna?", hint:"Think about what you imagined before you walked in."},
    {section:"THE FIRST TIME", type:"core", text:"How was the experience compared to what you expected?", hint:"Did anything surprise you?"},
    {section:"THE FIRST TIME", type:"extra", text:"Did your perception of saunas change after visiting one?", hint:"You can talk about the space, its atmosphere or how it works."},
    {section:"DESIRE & BELONGING", type:"core", text:"Why do you go, or why did you go, to saunas?", hint:"There may be more than one reason."},
    {section:"DESIRE & BELONGING", type:"core", text:"What do you find in a sauna that you might not find elsewhere?", hint:"Think beyond the obvious, if you like."},
    {section:"DESIRE & BELONGING", type:"extra", text:"Do you think you go there exclusively for sex, or is there something else?", hint:"No answer is expected."},
    {section:"DESIRE & BELONGING", type:"extra", text:"Have you ever visited a sauna without necessarily wanting to have sex? Why?", hint:"Tell us what brought you there."},
    {section:"THE DIGITAL WORLD", type:"core", text:"Do you think dating apps and the internet have pushed saunas into the background?", hint:"You can agree, disagree or feel both things at once."},
    {section:"THE DIGITAL WORLD", type:"extra", text:"What do saunas offer that the internet cannot?", hint:"Consider physical presence, anonymity, chance encounters or something else."},
    {section:"THE DIGITAL WORLD", type:"extra", text:"Why do you think people still go to saunas?", hint:"What do you think people are looking for when they enter?"},
    {section:"MEMORIES", type:"core", text:"Is there an experience in a sauna that you particularly remember?", hint:"It can be funny, tender, awkward, ordinary or unexpected."},
    {section:"MEMORIES", type:"extra", text:"Have you ever been surprised by something you experienced there?", hint:"A moment, a person, a feeling or a situation."},
    {section:"MEMORIES", type:"extra", text:"Is there something you've experienced in a sauna that you've never told anyone?", hint:"Only share what you feel comfortable sharing."},
    {section:"THE RITUAL", type:"core", text:"Do you think there's something almost ritualistic about going to a sauna?", hint:"Think about routines, repetition, anticipation or the feeling of entering another world."},
    {section:"THE RITUAL", type:"extra", text:"What do you think people are looking for when they enter a sauna?", hint:"This can be different from what they say they are looking for."},
    {section:"THE FINAL WORD", type:"core", text:"What would you tell someone who has never been to a sauna and is preparing for their first visit?", hint:"Imagine speaking to a friend before their first time."},
    {section:"THE FINAL WORD", type:"extra", text:"Describe a sauna in three words.", hint:"First words that come to mind are welcome."},
    {section:"THE FINAL WORD", type:"extra", text:"Do you think saunas are disappearing, or do they still offer something we need?", hint:"What might we lose if these spaces disappeared?"},
    {section:"THE FINAL WORD", type:"extra", text:"Is there anything I haven't asked that you'd like to confess?", hint:"This is your space. You can take the conversation somewhere else."}
  ] };

const copy = { en: {
    back:"← BACK TO THE ENTRANCE",stepAbout:"ABOUT",stepRelease:"RELEASE",stepConfession:"CONFESSION",stepSubmit:"SUBMIT",stepBack:"BACK",stepNext:"CONTINUE",guiltIntro:"Throughout history, the Church has often approached desire and sexuality through the language of sin and guilt. This project borrows the ritual of confession as a way to question the shame we may have been taught to carry. This is not a religious confession or a place of judgement. It is simply a space to speak freely, in your own words.",windowTitle:"Sunday At Church — The Confessional",eyebrow:"PHASE 01 / THE CONFESSIONAL",confTitle:"Welcome to the Confessional.",confIntro:"A place to leave a thought, a memory or a confession about sauna culture. You don't need to be a regular. You just need a story.",
    phaseOneTitle:"The Confessional",phaseOneText:"An open collection of personal testimonies, memories and perspectives. This first phase is about listening to as many different voices as possible.",phaseOneTag:"YOU ARE HERE",phaseTwoTitle:"The Conversation",phaseTwoText:"Some contributors may later be invited to a more in-depth, one-to-one filmed interview. Taking part now does not guarantee an invitation.",phaseTwoTag:"A POSSIBLE NEXT STEP",introNote:"The first phase is not a casting call. Your testimony matters on its own.",
    releaseWindowTitle:"01 — Participation & release",beforeBegin:"BEFORE YOU BEGIN",releaseTitle:"A quick formality.",releaseIntro:"Please complete the participation release through Adobe Sign before recording. Use the same legal name and email address in both places so the filmmaker can match them manually.",adobeTitle:"Sign your participation release",adobeIntro:"Choose the form in your preferred language. Adobe will send you a copy when the agreement is completed.",adobeCheck:"I have completed the Adobe Sign release.",adobeNote:"This checkbox is a declaration, not automatic proof of signature. Every submission remains pending until the filmmaker manually checks the signed PDF and the footage.",
    legalName:"Full legal name",legalNamePlaceholder:"Your legal name",email:"Email address",emailPlaceholder:"you@example.com",preferredPlaceholder:"Name to appear in the credits",dob:"Date of birth",creditChoice:"How would you like to be credited?",creditFull:"Use my full name",creditPreferred:"Use a preferred name",creditNone:"Do not credit me",preferredName:"Preferred credit name",agree:"I confirm that I am 18 or older, participation is voluntary, and I have read the participation and privacy information.",
    recorderWindowTitle:"02 — Your confession",recordEyebrow:"YOUR TESTIMONY",recordTitle:"Whenever you're ready.",recordIntro:"Start with the opening confession. The ten core prompts are the shared thread; the extra questions are there if you feel like saying more. Skip anything you don't want to answer.",openingLabel:"THE OPENING CONFESSION",openingPrompt:"“Forgive me, Father, for I've sinned. The last time I went to a sauna was…”",openingSub:"It could have been yesterday, a few months ago, or five years ago. It might have been your first and last time.",questionBankLabel:"QUESTION BANK",filterAll:"ALL",filterCore:"CORE",filterExtra:"EXTRA",coreType:"CORE QUESTION",extraType:"OPTIONAL QUESTION",hintDefault:"There is no right or wrong answer.",enableCamera:"ENABLE CAMERA",startRecording:"START RECORDING",stopRecording:"STOP",previous:"← PREVIOUS",next:"NEXT →",skipQuestion:"SKIP THIS QUESTION",recording:"Recording…",saved:"Answer saved in this browser session.",cameraReady:"Camera and microphone ready.",cameraError:"Could not access camera or microphone. Check browser permissions.",recordNotice:"Camera access requires HTTPS or localhost.",uploadEyebrow:"03 / SEND YOUR CONFESSION",uploadTitle:"Ready to send?",uploadIntro:"You can submit any recorded answers. Your participation will remain pending until the filmmaker manually verifies both your Adobe release and the uploaded footage.",submitAnswers:"SUBMIT ANSWERS",noClips:"Record at least one answer before submitting.",needRelease:"Please confirm that you have completed the Adobe Sign release.",needDetails:"Please complete your name, email, date of birth and participation declaration.",adultOnly:"You must be 18 or older to participate.",needPreferred:"Please enter the name you want used in the credits.",needTurnstile:"Complete the security verification.",sending:"Sending your answers securely…",received:"Submission received. Your reference is: ",failed:"Submission failed. Please try again later.",serviceOff:"The submission service is currently unavailable.",connectionError:"Could not connect to the server. Your clips remain in this browser session.",goToSubmit:"GO TO SUBMIT",closingNote:"Thank you for trusting us with your story. You can leave a question unanswered; silence is also an answer.",footerText:"THE CONFESSIONAL · PHASE 01"
  }
};

const lang = "en";
let currentIndex = 0, stream = null, recorder = null, chunks = [], clips = {};
let turnstileToken = "", turnstileWidgetId = null, activeFilter = "all";
let releaseMode = "standard", signatureMode = "typed", signatureHasInk = false;

// Local recovery: completed recordings are persisted in IndexedDB, not only in RAM.
// Browser storage is best-effort (not a substitute for a participant's own backup).
const LOCAL_DB_NAME = "SundayAtChurchConfessional";
const LOCAL_DB_VERSION = 1;
let localDbPromise = null;
let uploadSession = null;

function openLocalDb(){
  if(!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  if(localDbPromise) return localDbPromise;
  localDbPromise = new Promise((resolve,reject)=>{
    const request=indexedDB.open(LOCAL_DB_NAME,LOCAL_DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains("clips")) db.createObjectStore("clips",{keyPath:"key"});
      if(!db.objectStoreNames.contains("sessions")) db.createObjectStore("sessions",{keyPath:"key"});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error("Could not open local recording storage"));
  });
  return localDbPromise;
}
async function localPut(storeName,value){
  const db=await openLocalDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(storeName,"readwrite");
    tx.objectStore(storeName).put(value);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Local save failed"));
    tx.onabort=()=>reject(tx.error||new Error("Local save was interrupted"));
  });
}
async function localGetAll(storeName){
  const db=await openLocalDb();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(storeName,"readonly").objectStore(storeName).getAll();
    request.onsuccess=()=>resolve(request.result||[]);
    request.onerror=()=>reject(request.error||new Error("Local recovery failed"));
  });
}
async function localDeleteSession(){
  const db=await openLocalDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction("sessions","readwrite");
    tx.objectStore("sessions").delete("active");
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Could not clear upload session"));
  });
}
async function localClear(){
  const db=await openLocalDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(["clips","sessions"],"readwrite");
    tx.objectStore("clips").clear();
    tx.objectStore("sessions").clear();
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Could not clear local recordings"));
  });
}
async function persistClip(index,blob){
  await localPut("clips",{key:`clip-${index}`,index,blob,updatedAt:Date.now()});
}
async function persistUploadSession(){
  if(uploadSession) await localPut("sessions",{key:"active",value:uploadSession});
}
async function restoreLocalWork(){
  try{
    const saved=await localGetAll("clips");
    saved.forEach(item=>{if(item.blob instanceof Blob) clips[item.index]=item.blob;});
    const sessions=await localGetAll("sessions");
    const active=sessions.find(item=>item.key==="active");
    if(active) uploadSession=active.value;
    if(Object.keys(clips).length){
      renderQuestion();
      setStatus(t("recoveredLocal"));
      setUploadStatus(t("localRecoveryNotice"));
    }
    refreshSubmitState();
  }catch(error){
    console.warn("Local recording recovery is unavailable:",error);
    setStatus(t("localStorageWarning"));
  }
}
function localMessage(key){
  const messages={
    es:{
      recoveredLocal:"Hemos recuperado respuestas guardadas en este navegador.",
      localRecoveryNotice:"Hay grabaciones guardadas localmente. Mantén esta pestaña abierta hasta recibir el código de confirmación.",
      localStorageWarning:"No se pudo activar el guardado de recuperación. Descarga tus respuestas como copia de seguridad.",
      uploadStarting:"Preparando el envío seguro…",
      uploading:"Subiendo respuesta",
      uploaded:"Respuesta recibida y verificada",
      finalizing:"Comprobando todos los archivos en el almacenamiento…",
      retry:"No se ha podido completar el envío. Tus grabaciones siguen guardadas en este navegador; puedes volver a intentarlo.",
      received:"Envío recibido y archivos verificados. Tu referencia es: ",
      leaveWarning:"Tienes grabaciones que aún no han recibido confirmación. Si sales, podrías perder el acceso a ellas.",
      sessionExpired:"La sesión de envío ha caducado. Vuelve a verificarte para iniciar un nuevo envío; tus grabaciones siguen guardadas."
    },
    en:{
      recoveredLocal:"We recovered answers saved in this browser.",
      localRecoveryNotice:"Recordings are saved locally. Keep this tab open until you receive the confirmation code.",
      localStorageWarning:"Recovery storage could not be enabled. Please download your answers as a backup.",
      uploadStarting:"Preparing your secure submission…",
      uploading:"Uploading answer",
      uploaded:"Answer received and verified",
      finalizing:"Checking all files in secure storage…",
      retry:"The submission could not be completed. Your recordings remain saved in this browser; you can retry.",
      received:"Submission received and files verified. Your reference is: ",
      leaveWarning:"You have recordings that have not yet been confirmed. If you leave, you may lose access to them.",
      sessionExpired:"The upload session has expired. Please verify again to start a new submission; your recordings are still saved."
    }
  };
  return messages[lang]?.[key] || key;
}


function t(key){return copy[lang][key] || key;}

let activeStep = 0;
function showStep(step){
  activeStep=Math.max(0,Math.min(3,step));
  document.querySelectorAll(".step-panel").forEach(panel=>{
    const active=Number(panel.dataset.panel)===activeStep;
    panel.hidden=!active;
    panel.classList.toggle("active",active);
  });
  document.querySelectorAll(".step-link").forEach(link=>{
    const n=Number(link.dataset.step);
    link.classList.toggle("active",n===activeStep);
    link.classList.toggle("completed",n<activeStep);
    link.setAttribute("aria-current",n===activeStep?"step":"false");
  });
  $("stepProgress").style.width=((activeStep+1)*25)+"%";
  $("stepBack").disabled=activeStep===0;
  $("stepNext").hidden=activeStep===3;
  $("stepNext").textContent=activeStep===2?t("goToSubmit"):t("stepNext");
  const activePanel=document.querySelector(`.step-panel[data-panel="${activeStep}"]`);
  if(activePanel) activePanel.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll(".step-link").forEach(link=>link.addEventListener("click",()=>{
  const target=Number(link.dataset.step);
  // The release must be completed before the recording stage.
  if(target>=2 && !releaseReady()){showStep(1);setStatus(t("needDetails"));return;}
  if(target===3 && Object.keys(clips).length===0){showStep(2);setUploadStatus(t("noClips"));return;}
  showStep(target);
}));
function releaseReady(){
  if(releaseMode === "anonymous"){
    const signatureOk = signatureMode === "typed" ? $("typedSignature").value.trim().length > 0 : signatureHasInk;
    return $("anonymousAge").checked && $("anonymousReleaseAgree").checked && $("anonymousConsent").checked && signatureOk;
  }
  return $("agree").checked && $("adobeReleaseCompleted").checked &&
    $("legalName").value.trim() && $("email").value.trim() &&
    $("dob").value && adultFromDate($("dob").value);
}
$("stepBack").addEventListener("click",()=>showStep(activeStep-1));
$("stepNext").addEventListener("click",()=>{
  if(activeStep===0){showStep(1);return;}
  if(activeStep===1){
    if(!releaseReady()){setStatus(t("needDetails"));return;}
    showStep(2);return;
  }
  if(activeStep===2){
    if(Object.keys(clips).length===0){setUploadStatus(t("noClips"));return;}
    showStep(3);
  }
});

function setStatus(message){$("status").textContent=message;}
function setUploadStatus(message){$("uploadStatus").textContent=message;}
function setUploadProgress(value){
  const bar=$("uploadProgress");
  if(!bar)return;
  bar.hidden=false;
  bar.value=Math.max(0,Math.min(100,Number(value)||0));
}
function adultFromDate(value){
  if(!value)return false;
  const dob=new Date(value+"T00:00:00");
  if(Number.isNaN(dob.getTime()))return false;
  const now=new Date();let age=now.getFullYear()-dob.getFullYear();
  if(now.getMonth()<dob.getMonth()||(now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate()))age--;
  return age>=18;
}
function visibleQuestionIndexes(){
  return questionBank[lang].map((q,i)=>({q,i})).filter(({q})=>activeFilter==="all"||(activeFilter==="core"?q.type==="core":q.type==="extra")).map(x=>x.i);
}
function renderQuestion(){
  const q=questionBank[lang][currentIndex];
  $("questionCount").textContent=`${String(currentIndex+1).padStart(2,"0")} / 20`;
  $("questionSection").textContent=q.section;
  $("questionType").textContent=q.type==="core"?t("coreType"):t("extraType");
  $("question").textContent=q.text;
  $("questionHint").textContent=q.hint || t("hintDefault");
  $("prevBtn").disabled=currentIndex===0;
  $("nextBtn").disabled=currentIndex===19;
  $("prevBtn").textContent=t("previous");$("nextBtn").textContent=t("next");
  const existing=clips[currentIndex];
  $("downloads").innerHTML="";
  if(existing){
    const a=document.createElement("a");a.href=URL.createObjectURL(existing);a.download=`sunday-at-church-question-${String(currentIndex+1).padStart(2,"0")}.webm`;a.textContent=`DOWNLOAD ANSWER ${currentIndex+1} ↓`;$("downloads").appendChild(a);
    setStatus(t("saved"));
  }else setStatus("");
}
function applyLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.textContent=copy[lang][key];});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{const key=el.dataset.i18nPlaceholder;if(copy[lang][key])el.placeholder=copy[lang][key];});
  $("adobeFormEn").hidden=false;
  $("releaseCopy").innerHTML = `<h3>Permission to record and use your contribution</h3><p>I give the production of <em>Sunday At Church</em> permission to record my image, voice and answers through this online Confessional, and to consider my contribution for inclusion in the documentary.</p><h3>Use of the documentary</h3><p>The intended uses may include educational screenings, film festivals, cinemas, cultural exhibitions, television, streaming, online distribution and promotional materials. My contribution may be edited, shortened, rearranged or subtitled, but should not knowingly be used in a materially misleading context.</p><h3>Voluntary participation and privacy</h3><p>My participation is voluntary and unpaid. I understand that the project explores intimacy, sexuality and queer community, and that appearing in it may reveal information about me. Any anonymity or credit restrictions should be agreed before recording. I may ask questions before participating.</p><h3>Privacy information</h3><p>Please read the separate privacy notice before submitting. You may contact <a href="mailto:hi@javierbotellaperez.com">hi@javierbotellaperez.com</a> with questions about this project or your information.</p>`;
  renderQuestion();
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));const indexes=visibleQuestionIndexes();if(!indexes.includes(currentIndex))currentIndex=indexes[0]??0;renderQuestion();}));
$("prevBtn").addEventListener("click",()=>{currentIndex=Math.max(0,currentIndex-1);renderQuestion();});
$("nextBtn").addEventListener("click",()=>{currentIndex=Math.min(19,currentIndex+1);renderQuestion();});
$("skipBtn").addEventListener("click",()=>{const indexes=visibleQuestionIndexes();const pos=indexes.indexOf(currentIndex);currentIndex=indexes[Math.min(pos+1,indexes.length-1)]??currentIndex;renderQuestion();});
$("credit").addEventListener("change",()=>{$("preferredWrap").hidden=$("credit").value!=="preferred";});


function setReleaseMode(mode){
  releaseMode=mode;
  try{localStorage.setItem("sac-release-mode",mode);}catch(_){}
  $("standardReleaseFields").hidden=mode!=="standard";
  $("anonymousRelease").hidden=mode!=="anonymous";
  $("chooseStandard").classList.toggle("secondary",mode!=="standard");
  $("chooseAnonymous").classList.toggle("secondary",mode!=="anonymous");
  setStatus("");
}
$("chooseStandard").addEventListener("click",()=>setReleaseMode("standard"));
$("chooseAnonymous").addEventListener("click",()=>setReleaseMode("anonymous"));
$("signatureTypedMode").addEventListener("click",()=>{
  signatureMode="typed";$("typedSignatureWrap").hidden=false;$("drawnSignatureWrap").hidden=true;
});
$("signatureDrawnMode").addEventListener("click",()=>{
  signatureMode="drawn";$("typedSignatureWrap").hidden=true;$("drawnSignatureWrap").hidden=false;
});
const signatureCanvas=$("signatureCanvas"), signatureCtx=signatureCanvas.getContext("2d");
signatureCtx.strokeStyle="#17263b";signatureCtx.lineWidth=4;signatureCtx.lineCap="round";signatureCtx.lineJoin="round";
let signatureDrawing=false;
function signaturePoint(event){
  const rect=signatureCanvas.getBoundingClientRect();
  const touch=event.touches?.[0];
  const clientX=touch?touch.clientX:event.clientX, clientY=touch?touch.clientY:event.clientY;
  return {x:(clientX-rect.left)*signatureCanvas.width/rect.width,y:(clientY-rect.top)*signatureCanvas.height/rect.height};
}
function signatureStart(event){event.preventDefault();signatureDrawing=true;const p=signaturePoint(event);signatureCtx.beginPath();signatureCtx.moveTo(p.x,p.y);}
function signatureMove(event){if(!signatureDrawing)return;event.preventDefault();const p=signaturePoint(event);signatureCtx.lineTo(p.x,p.y);signatureCtx.stroke();signatureHasInk=true;}
function signatureEnd(){signatureDrawing=false;}
signatureCanvas.addEventListener("pointerdown",signatureStart);
signatureCanvas.addEventListener("pointermove",signatureMove);
window.addEventListener("pointerup",signatureEnd);
$("clearSignature").addEventListener("click",()=>{signatureCtx.clearRect(0,0,signatureCanvas.width,signatureCanvas.height);signatureHasInk=false;});
async function buildAnonymousReleasePdf(){
  if(!window.jspdf?.jsPDF) throw new Error("The PDF signing library could not be loaded. Please reload the page and try again.");
  const signatureText=$("typedSignature").value.trim();
  const signatureImage=signatureMode==="drawn"&&signatureHasInk?signatureCanvas.toDataURL("image/png"):null;
  if(signatureMode==="typed"&&!signatureText) throw new Error("Please type your signature.");
  if(signatureMode==="drawn"&&!signatureImage) throw new Error("Please draw your signature.");
  const {jsPDF}=window.jspdf, doc=new jsPDF({unit:"mm",format:"a4"});
  const isEs=lang==="es", margin=18, width=174;
  let y=20;
  const title=isEs?"SUNDAY AT CHURCH — AUTORIZACIÓN ANÓNIMA DE PARTICIPACIÓN":"SUNDAY AT CHURCH — ANONYMOUS PARTICIPANT RELEASE";
  doc.setFont("helvetica","bold");doc.setFontSize(15);doc.text(title,margin,y,{maxWidth:width});y+=15;
  doc.setFont("helvetica","normal");doc.setFontSize(9);
  const paragraphs=isEs?[
    "Referencia de participación: se asignará al recibir el envío. Seudónimo opcional: "+($("anonymousPseudonym").value.trim()||"No facilitado"),
    "1. AUTORIZACIÓN PARA GRABAR Y UTILIZAR. Autorizo a Javier Botella Pérez a grabar y utilizar mi imagen, apariencia, voz, respuestas, testimonios y aportaciones para Sunday At Church, incluido el Confesionario online. El Confesionario online no solicita ni incluye desnudez ni actividad sexual. Mi participación es voluntaria y puedo omitir cualquier pregunta.",
    "2. CRÉDITO Y ANONIMATO. Puedo utilizar un seudónimo o no aparecer en los créditos. Si deseo anonimato en la grabación, soy responsable de adoptar precauciones antes y durante la grabación. La producción no modificará visualmente el material para ocultar mi identidad, incluidos desenfoques, máscaras, recortes o eliminación de detalles identificativos. Solo podrá acordarse previamente una modificación del tono de voz. No se puede garantizar el anonimato: la voz, el cuerpo, la historia, el entorno o el contexto podrían identificarme.",
    "3. EDICIÓN, USO Y DISTRIBUCIÓN. Concedo al Director permiso mundial, sin fecha fija de finalización, para incorporar, reproducir, editar, adaptar, subtitular, exhibir, distribuir y utilizar mi participación en Sunday At Church y sus versiones, incluidas proyecciones académicas, festivales, cines, exposiciones culturales, televisión, streaming, distribución online y promoción relacionada con el proyecto. La aportación podrá seleccionarse, acortarse, ordenarse, reorganizarse y subtitularse, pero no se utilizará conscientemente en un contexto sustancialmente engañoso. No tengo derecho automático a aprobar el montaje final. Esto no transfiere la titularidad de obras preexistentes ni renuncia a derechos irrenunciables. No se promete remuneración, regalías ni participación en ingresos.",
    "4. ARCHIVO Y FUTURA PRODUCTORA. El Director podrá conservar materiales del proyecto como archivo documental y crear o utilizar una productora en el futuro. Cualquier cesión o licencia deberá ser legal y coherente con esta autorización y el Aviso de Privacidad. Una futura empresa no adquiere automáticamente el derecho a utilizar datos personales por recibir los derechos de la película.",
    "5. PARTICIPACIÓN VOLUNTARIA Y RETIRADA. La participación es voluntaria y no remunerada. Puedo omitir preguntas y detenerme antes de enviar mi aportación. Puedo contactar con el Director para retirar mi consentimiento para futuros tratamientos cuando sea la base jurídica. La retirada no afecta al tratamiento lícito anterior; puede que no sea posible recuperar materiales distribuidos lícitamente a terceros o incorporados a copias fuera del control del Director. Se mantienen mis derechos legales.",
    "6. CONSENTIMIENTO EXPLÍCITO PARA PROTECCIÓN DE DATOS. Las aportaciones pueden revelar información sobre la vida u orientación sexual, que puede constituir una categoría especial de datos según el artículo 9 del RGPD. El Aviso de Privacidad explica finalidades, bases jurídicas, destinatarios, almacenamiento y derechos. Doy mi consentimiento explícito al tratamiento de los datos de categorías especiales que decida revelar para las finalidades documentales descritas en dicho aviso. Puedo retirar el consentimiento para futuros tratamientos cuando sea la base jurídica.",
    "Al firmar, confirmo que tengo al menos 18 años, que he leído y comprendido esta autorización y el Aviso de Privacidad y que he tenido oportunidad de formular preguntas. Contacto: hi@javierbotellaperez.com."
  ]:[
    "Participant reference: assigned when the submission is received. Optional pseudonym: "+($("anonymousPseudonym").value.trim()||"Not provided"),
    "1. PERMISSION TO RECORD AND USE. I give Javier Botella Pérez permission to record and use my image, appearance, voice, answers, testimony and contributions for Sunday At Church, including the online Confessional. The online Confessional does not request or include nudity or sexual activity. Participation is voluntary; I may decline any question.",
    "2. CREDIT AND ANONYMITY. I may use a pseudonym or choose no public credit. If I seek anonymity in footage, I am responsible for precautions before and during recording. The production will not visually alter footage to conceal identity, including blur, masking, cropping or removing identifying details. Only voice-pitch alteration may be agreed in advance. Anonymity cannot be guaranteed; voice, body, story, surroundings or context may identify me.",
    "3. EDITING, USE AND DISTRIBUTION. I grant the Director worldwide permission, without a fixed end date, to incorporate, reproduce, edit, adapt, subtitle, exhibit, distribute and otherwise use my contribution in Sunday At Church and its versions, including academic screenings, festivals, cinemas, cultural exhibitions, television, streaming, online distribution and project-related promotion. The contribution may be selected, shortened, sequenced, rearranged and subtitled, but will not knowingly be used in a materially misleading context. I have no automatic right to approve the final edit. This does not transfer ownership of pre-existing work or waive non-waivable rights. No payment, royalties or revenue share is promised.",
    "4. ARCHIVE AND FUTURE PRODUCTION COMPANY. The Director may preserve project materials as a documentary archive and may later establish or use a production company. Any transfer or licence must be lawful and consistent with this release and the Privacy Notice. A future company does not automatically gain the right to use personal data merely by receiving film rights.",
    "5. VOLUNTARY PARTICIPATION AND WITHDRAWAL. Participation is voluntary and unpaid. I may skip questions and stop before submitting. I may contact the Director to withdraw consent for future processing where consent is the legal basis. Withdrawal does not affect lawful prior processing; material already distributed to third parties or incorporated into copies outside the Director's control may not be retrievable. Statutory rights remain unaffected.",
    "6. EXPLICIT DATA-PROTECTION CONSENT. Contributions may reveal information about sex life or sexual orientation, which may be special-category personal data under Article 9 GDPR. The Privacy Notice explains purposes, legal bases, recipients, storage and rights. I explicitly consent to processing special-category data I choose to disclose for the documentary purposes in that notice. I may withdraw consent for future processing where consent is the legal basis.",
    "By signing, I confirm that I am at least 18, have read and understood this release and the accompanying Privacy Notice, and had the opportunity to ask questions. Contact: hi@javierbotellaperez.com."
  ];
  for(const para of paragraphs){
    const lines=doc.splitTextToSize(para,width);
    const needed=lines.length*4.2+4;
    if(y+needed>270){doc.addPage();y=20;}
    doc.text(lines,margin,y);y+=needed;
  }
  if(y>245){doc.addPage();y=20;}
  doc.setFont("helvetica","bold");doc.text(isEs?"FIRMA DE LA PERSONA PARTICIPANTE":"PARTICIPANT SIGNATURE",margin,y);y+=8;
  if(signatureImage){doc.addImage(signatureImage,"PNG",margin,y,75,19);y+=24;}
  else{doc.setFont("times","italic");doc.setFontSize(20);doc.text(signatureText,margin,y+8);y+=18;}
  doc.setFont("helvetica","normal");doc.setFontSize(9);
  doc.text((isEs?"Fecha y hora: ":"Date and time: ")+new Date().toISOString(),margin,y+4);
  doc.text("Sunday At Church · "+(isEs?"Documento de participación":"Participant release"),margin,285);
  return doc.output("datauristring").split(",")[1];
}

window.onTurnstileLoad=function(){
  if(!window.turnstile||turnstileWidgetId!==null)return;
  turnstileWidgetId=window.turnstile.render("#turnstileWidget",{sitekey:TURNSTILE_SITE_KEY,
    callback:token=>{turnstileToken=token;refreshSubmitState();setUploadStatus("");},
    "expired-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus("Verification expired. Please verify again.");},
    "error-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus("Verification could not be completed.");}
  });
};
function refreshSubmitState(){const hasClips=Object.keys(clips).length>0;$("submitBtn").disabled=!(hasClips&&(turnstileToken||uploadSession));}
$("cameraBtn").addEventListener("click",async()=>{
  try{stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});$("preview").srcObject=stream;$("recordBtn").disabled=false;setStatus(t("cameraReady"));}
  catch(e){setStatus(t("cameraError"));}
});
$("recordBtn").addEventListener("click",()=>{
  if(!releaseReady()){setStatus(t("needDetails"));return;}
  if(!stream)return;
  chunks=[];
  let mime="video/webm";
  if(MediaRecorder.isTypeSupported("video/webm;codecs=vp9"))mime="video/webm;codecs=vp9";
  else if(MediaRecorder.isTypeSupported("video/webm;codecs=vp8"))mime="video/webm;codecs=vp8";
  recorder=new MediaRecorder(stream,{mimeType:mime});
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  recorder.onstop=async()=>{
    const type=(recorder.mimeType||"video/webm").split(";")[0];
    const completedBlob=new Blob(chunks,{type});
    clips[currentIndex]=completedBlob;
    renderQuestion();refreshSubmitState();
    try{
      await persistClip(currentIndex,completedBlob);
      setStatus(t("saved"));
    }catch(error){
      console.warn("Could not persist this recording:",error);
      setStatus(localMessage("localStorageWarning"));
    }
  };
  recorder.start();$("recordBtn").disabled=true;$("stopBtn").disabled=false;setStatus(t("recording"));
});
$("stopBtn").addEventListener("click",()=>{if(recorder&&recorder.state!=="inactive"){recorder.stop();$("recordBtn").disabled=false;$("stopBtn").disabled=true;}});
$("submitBtn").addEventListener("click",async()=>{
  setUploadStatus("");
  const legalName=$("legalName").value.trim(),email=$("email").value.trim(),dob=$("dob").value;
  const credit=$("credit").value,preferredName=$("preferredName").value.trim();
  if(!releaseReady()){setUploadStatus(t("needDetails"));return;}
  if(releaseMode==="standard" && credit==="preferred"&&!preferredName){setUploadStatus(t("needPreferred"));return;}
  if(!uploadSession&&!turnstileToken){setUploadStatus(t("needTurnstile"));return;}
  const keys=Object.keys(clips).map(Number).sort((a,b)=>a-b);
  if(!keys.length){setUploadStatus(t("noClips"));return;}

  const button=$("submitBtn");
  button.disabled=true;
  setUploadProgress(0);
  try{
    // Create a private, short-lived upload session. Turnstile is checked once here.
    if(!uploadSession){
      setUploadStatus(localMessage("uploadStarting"));
      const initResponse=await fetch(`${API_BASE}/api/submissions/init`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          releaseMode,legalName,email,dob,
          consent:releaseMode==="anonymous"?$("anonymousConsent").checked:$("agree").checked,
          ageConfirmed:releaseMode==="anonymous"?$("anonymousAge").checked:false,
          adobeReleaseDeclared:releaseMode==="standard"?$("adobeReleaseCompleted").checked:false,
          anonymousReleasePdfBase64:releaseMode==="anonymous"?await buildAnonymousReleasePdf():"",
          pseudonym:$("anonymousPseudonym").value.trim(),
          credit,preferredName,language:lang,turnstileToken,answers:keys.map(k=>k+1)
        })
      });
      const initResult=await initResponse.json().catch(()=>({}));
      if(!initResponse.ok) throw new Error(initResult.error||t("failed"));
      uploadSession={submissionId:initResult.submissionId,uploadToken:initResult.uploadToken,completed:[]};
      await persistUploadSession();
      turnstileToken="";
      if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
    }

    // Each answer is uploaded separately. A failed answer can be retried without
    // bundling every recording into one large multipart request.
    for(let i=0;i<keys.length;i++){
      const questionNumber=keys[i]+1;
      if(uploadSession.completed.includes(questionNumber)) continue;
      const blob=clips[keys[i]];
      const contentType=blob.type==="video/mp4"?"video/mp4":"video/webm";
      setUploadStatus(`${localMessage("uploading")} ${i+1}/${keys.length} · ${Math.round(blob.size/1024/1024*10)/10} MB`);
      const response=await fetch(`${API_BASE}/api/submissions/${uploadSession.submissionId}/answers/${questionNumber}`,{
        method:"PUT",
        headers:{"Authorization":`Bearer ${uploadSession.uploadToken}`,"Content-Type":contentType},
        body:blob
      });
      const result=await response.json().catch(()=>({}));
      if(response.status===401){
        uploadSession=null;
        await localDeleteSession();
        if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
        turnstileToken="";
        throw new Error(localMessage("sessionExpired"));
      }
      if(!response.ok) throw new Error(result.error||t("failed"));
      uploadSession.completed.push(questionNumber);
      await persistUploadSession();
      setUploadProgress(Math.round(uploadSession.completed.length/keys.length*100));
      setUploadStatus(`${localMessage("uploaded")} ${i+1}/${keys.length}`);
    }

    setUploadProgress(100);
    setUploadStatus(localMessage("finalizing"));
    const finalResponse=await fetch(`${API_BASE}/api/submissions/${uploadSession.submissionId}/finalize`,{
      method:"POST",headers:{"Authorization":`Bearer ${uploadSession.uploadToken}`}
    });
    const finalResult=await finalResponse.json().catch(()=>({}));
    if(finalResponse.status===401){
      uploadSession=null;
      await localDeleteSession();
      if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
      turnstileToken="";
      throw new Error(localMessage("sessionExpired"));
    }
    if(!finalResponse.ok) throw new Error(finalResult.error||t("failed"));
    if(!finalResult.ok||!finalResult.submissionId||finalResult.verifiedAnswers?.length!==keys.length){
      throw new Error(t("failed"));
    }

    const reference=finalResult.submissionId;
    // Clear local recordings only after the Worker confirms all R2 objects and metadata.
    try{await localClear();}catch(error){console.warn("Upload succeeded but local cleanup failed:",error);}
    clips={};uploadSession=null;renderQuestion();refreshSubmitState();
    setUploadStatus(localMessage("received")+reference);
  }catch(error){
    console.error("Submission upload failed:",error);
    setUploadStatus(`${localMessage("retry")} ${error.message||""}`);
  }finally{
    refreshSubmitState();
  }
});
window.addEventListener("beforeunload",(event)=>{
  if(stream)stream.getTracks().forEach(track=>track.stop());
  if(Object.keys(clips).length){
    event.preventDefault();
    event.returnValue=localMessage("leaveWarning");
    return event.returnValue;
  }
});
try{
  const savedReleaseMode=localStorage.getItem("sac-release-mode");
  if(savedReleaseMode==="anonymous"||savedReleaseMode==="standard")setReleaseMode(savedReleaseMode);
}catch(_){}
setReleaseMode("standard");
applyLanguage();
showStep(0);
restoreLocalWork();
