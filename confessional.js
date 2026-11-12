const $ = (id) => document.getElementById(id);
const API_BASE = "https://sundayatchurch-api.hi-d37.workers.dev";
const TURNSTILE_SITE_KEY = "0x4AAAAAAF-g4KWyfvHl1wnb";

const questionBank = { es: [
    {section:"LA CONFESIÓN", type:"core", text:"Ave María Purísima. La última vez que fui a una sauna fue…", hint:"Di cuánto tiempo ha pasado. Puede haber sido ayer, hace cinco años o tu primera y última visita."},
    {section:"LA PRIMERA VEZ", type:"core", text:"¿Qué esperabas encontrar la primera vez que fuiste a una sauna?", hint:"Piensa en lo que imaginabas antes de entrar."},
    {section:"LA PRIMERA VEZ", type:"core", text:"¿Cómo fue la experiencia en comparación con lo que esperabas?", hint:"¿Hubo algo que te sorprendiera?"},
    {section:"LA PRIMERA VEZ", type:"extra", text:"¿Cambió tu percepción de las saunas después de visitar una?", hint:"Puedes hablar del espacio, de su ambiente o de cómo funciona."},
    {section:"DESEO Y PERTENENCIA", type:"core", text:"¿Por qué vas, o por qué ibas, a las saunas?", hint:"Puede haber más de un motivo."},
    {section:"DESEO Y PERTENENCIA", type:"core", text:"¿Qué encuentras en una sauna que quizá no encuentres en otros lugares?", hint:"Si quieres, piensa más allá de lo evidente."},
    {section:"DESEO Y PERTENENCIA", type:"extra", text:"¿Crees que vas allí exclusivamente por sexo o hay algo más?", hint:"No hay una respuesta esperada."},
    {section:"DESEO Y PERTENENCIA", type:"extra", text:"¿Has ido alguna vez a una sauna sin tener necesariamente ganas de mantener relaciones sexuales? ¿Por qué?", hint:"Cuéntanos qué te llevó allí."},
    {section:"EL MUNDO DIGITAL", type:"core", text:"¿Crees que las aplicaciones de citas e internet han relegado las saunas a un segundo plano?", hint:"Puedes estar de acuerdo, en desacuerdo o sentir ambas cosas."},
    {section:"EL MUNDO DIGITAL", type:"extra", text:"¿Qué ofrecen las saunas que internet no puede ofrecer?", hint:"Piensa en la presencia física, el anonimato, los encuentros fortuitos u otra cosa."},
    {section:"EL MUNDO DIGITAL", type:"extra", text:"¿Por qué crees que la gente sigue yendo a las saunas?", hint:"¿Qué crees que buscan las personas cuando entran?"},
    {section:"RECUERDOS", type:"core", text:"¿Hay alguna experiencia en una sauna que recuerdes especialmente?", hint:"Puede ser divertida, tierna, incómoda, cotidiana o inesperada."},
    {section:"RECUERDOS", type:"extra", text:"¿Te ha sorprendido alguna vez algo que hayas vivido allí?", hint:"Un momento, una persona, una sensación o una situación."},
    {section:"RECUERDOS", type:"extra", text:"¿Has vivido algo en una sauna que nunca le hayas contado a nadie?", hint:"Comparte solo aquello con lo que te sientas cómodo."},
    {section:"EL RITUAL", type:"core", text:"¿Crees que hay algo casi ritual en el hecho de ir a una sauna?", hint:"Piensa en las rutinas, la repetición, la anticipación o la sensación de entrar en otro mundo."},
    {section:"EL RITUAL", type:"extra", text:"¿Qué crees que busca la gente cuando entra en una sauna?", hint:"Puede que no coincida con lo que dicen que buscan."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"core", text:"¿Qué le dirías a alguien que nunca ha ido a una sauna y se prepara para su primera visita?", hint:"Imagina que hablas con un amigo antes de su primera vez."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"Describe una sauna en tres palabras.", hint:"Las primeras palabras que te vengan a la cabeza sirven."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"¿Crees que las saunas están desapareciendo o que todavía ofrecen algo que necesitamos?", hint:"¿Qué podríamos perder si estos espacios desaparecieran?"},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"¿Hay algo que no te haya preguntado y que te gustaría confesar?", hint:"Este es tu espacio. Puedes llevar la conversación a otro lugar."}
  ] };

const copy = { es: {
    back:"← VOLVER A LA ENTRADA",
    stepAbout:"INICIO",
    stepRelease:"CONSENTIMIENTO",
    stepConfession:"CONFESIÓN",
    stepSubmit:"ENVIAR",
    stepBack:"VOLVER",
    stepNext:"CONTINUAR",
    guiltIntro:"A lo largo de la historia, la Iglesia ha abordado a menudo el deseo y la sexualidad a través del lenguaje del pecado y la culpa. Este proyecto toma prestado el ritual de la confesión para cuestionar la vergüenza que quizá nos han enseñado a cargar. Esto no es una confesión religiosa ni un espacio de juicio. Es, sencillamente, un lugar para hablar con libertad y con tus propias palabras.",
    windowTitle:"Sunday At Church — El Confesionario",
    eyebrow:"FASE 01 / EL CONFESIONARIO",
    confTitle:"Te damos la bienvenida al Confesionario.",
    confIntro:"Un espacio para compartir una idea, un recuerdo o una confesión sobre la cultura de las saunas. No hace falta que seas asiduo. Solo que tengas una historia.",
    phaseOneTitle:"El Confesionario",
    phaseOneText:"Una colección abierta de testimonios personales, recuerdos y puntos de vista. En esta primera fase queremos escuchar tantas voces diferentes como sea posible.",
    phaseOneTag:"ESTÁS AQUÍ",
    phaseTwoTitle:"La Conversación",
    phaseTwoText:"Más adelante, algunas personas participantes podrían recibir una invitación para una entrevista individual filmada y más profunda. Participar ahora no garantiza una invitación.",
    phaseTwoTag:"UN POSIBLE SIGUIENTE PASO",
    introNote:"Esta primera fase no es un proceso de casting. Tu testimonio tiene valor por sí mismo.",
    releaseWindowTitle:"01 — Participación y autorización",
    beforeBegin:"ANTES DE EMPEZAR",
    releaseTitle:"Un trámite necesario.",
    releaseIntro:"Antes de grabar, completa la autorización de participación a través de Adobe Sign. Utiliza el mismo nombre legal y la misma dirección de correo electrónico en ambos formularios para que el cineasta pueda relacionarlos manualmente.",
    adobeTitle:"Firma la autorización de participación",
    adobeIntro:"Completa la autorización de participación en castellano. Cuando hayas terminado, Adobe te enviará una copia del documento firmado.",
    adobeCheck:"He completado la autorización de Adobe Sign.",
    adobeNote:"Esta casilla es una declaración, no una verificación automática de la firma. Todas las participaciones quedan pendientes hasta que el cineasta compruebe manualmente el PDF firmado y los vídeos recibidos.",
    legalName:"Nombre y apellidos (nombre legal)",
    legalNamePlaceholder:"Tu nombre legal",
    email:"Correo electrónico",
    emailPlaceholder:"tu@correo.com",
    preferredPlaceholder:"Nombre que quieres utilizar en los créditos",
    dob:"Fecha de nacimiento",
    creditChoice:"¿Cómo quieres aparecer en los créditos?",
    creditFull:"Utilizar mi nombre completo",
    creditPreferred:"Utilizar un nombre elegido",
    creditNone:"No incluir mi nombre",
    preferredName:"Nombre para los créditos",
    agree:"Confirmo que tengo 18 años o más, que mi participación es voluntaria y que he leído la información sobre participación y privacidad.",
    recorderWindowTitle:"02 — Tu confesión",
    recordEyebrow:"TU TESTIMONIO",
    recordTitle:"Cuando quieras.",
    recordIntro:"Empieza con la confesión inicial. Las diez preguntas principales forman un hilo común; las preguntas opcionales están ahí por si quieres contar algo más. Puedes saltarte cualquiera que no quieras responder.",
    openingLabel:"LA CONFESIÓN INICIAL",
    openingPrompt:"«Ave María Purísima. La última vez que fui a una sauna fue…»",
    openingSub:"Pudo ser ayer, hace unos meses o hace cinco años. Quizá fue tu primera y última vez.",
    questionBankLabel:"BANCO DE PREGUNTAS",
    filterAll:"TODAS",
    filterCore:"PRINCIPALES",
    filterExtra:"OPCIONALES",
    coreType:"PREGUNTA PRINCIPAL",
    extraType:"PREGUNTA OPCIONAL",
    hintDefault:"No hay respuestas correctas ni incorrectas.",
    enableCamera:"ACTIVAR CÁMARA",
    startRecording:"EMPEZAR A GRABAR",
    stopRecording:"DETENER",
    previous:"← ANTERIOR",
    next:"SIGUIENTE →",
    skipQuestion:"SALTAR PREGUNTA",
    recording:"Grabando…",
    saved:"Respuesta guardada en esta sesión del navegador.",
    cameraReady:"Cámara y micrófono preparados.",
    cameraError:"No se ha podido acceder a la cámara o al micrófono. Comprueba los permisos del navegador.",
    recordNotice:"Para acceder a la cámara es necesario utilizar HTTPS o localhost.",
    uploadEyebrow:"03 / ENVIAR TU CONFESIÓN",
    uploadTitle:"¿Todo listo para enviar?",
    uploadIntro:"Puedes enviar cualquiera de las respuestas grabadas. Tu participación quedará pendiente hasta que el cineasta compruebe manualmente tanto la autorización de Adobe como los vídeos recibidos.",
    submitAnswers:"ENVIAR RESPUESTAS",
    noClips:"Graba al menos una respuesta antes de enviar.",
    needRelease:"Confirma que has completado la autorización de Adobe Sign.",
    needDetails:"Completa tu nombre, correo electrónico, fecha de nacimiento y la declaración de participación.",
    adultOnly:"Para participar debes tener 18 años o más.",
    needPreferred:"Indica el nombre que quieres utilizar en los créditos.",
    needTurnstile:"Completa la verificación de seguridad.",
    sending:"Enviando tus respuestas de forma segura…",
    received:"Hemos recibido tu envío. Tu referencia es: ",
    failed:"No se ha podido enviar. Inténtalo de nuevo más tarde.",
    serviceOff:"El servicio de envío no está disponible en este momento.",
    connectionError:"No se ha podido conectar con el servidor. Tus vídeos siguen en esta sesión del navegador.",
    goToSubmit:"IR A ENVIAR",
    closingNote:"Gracias por confiar en nosotros y compartir tu historia. Puedes dejar preguntas sin responder; el silencio también es una respuesta.",
    footerText:"EL CONFESIONARIO · FASE 01"
  } };

const lang = "es";
let currentIndex = 0, stream = null, recorder = null, chunks = [], clips = {};
let turnstileToken = "", turnstileWidgetId = null, activeFilter = "all";

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
    const a=document.createElement("a");a.href=URL.createObjectURL(existing);a.download=`sunday-at-church-question-${String(currentIndex+1).padStart(2,"0")}.webm`;a.textContent=`DESCARGAR RESPUESTA ${currentIndex+1} ↓`;$("downloads").appendChild(a);
    setStatus(t("saved"));
  }else setStatus("");
}
function applyLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.textContent=copy[lang][key];});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{const key=el.dataset.i18nPlaceholder;if(copy[lang][key])el.placeholder=copy[lang][key];});
  $("adobeFormEs").hidden=false;
  $("releaseCopy").innerHTML = `<h3>Permiso para grabar y utilizar tu participación</h3><p>Autorizo a la producción de <em>Sunday At Church</em> a grabar mi imagen, mi voz y mis respuestas a través de este Confesionario en línea, y a valorar la inclusión de mi participación en el documental.</p><h3>Usos del documental</h3><p>Los usos previstos pueden incluir proyecciones educativas, festivales de cine, salas de cine, exposiciones culturales, televisión, plataformas de streaming, distribución en línea y materiales promocionales. Mi participación podrá editarse, acortarse, reordenarse o subtitularse, pero no deberá utilizarse deliberadamente en un contexto que distorsione sustancialmente su sentido.</p><h3>Participación voluntaria y privacidad</h3><p>Mi participación es voluntaria y no remunerada. Entiendo que el proyecto explora la intimidad, la sexualidad y la comunidad queer, y que aparecer en él puede revelar información sobre mí. Cualquier condición relativa al anonimato o a los créditos deberá acordarse antes de grabar. Puedo plantear mis dudas antes de participar.</p><h3>Información sobre privacidad</h3><p>Lee el aviso de privacidad independiente antes de enviar tu participación. Puedes escribir a <a href="mailto:hi@javierbotellaperez.com">hi@javierbotellaperez.com</a> si tienes preguntas sobre el proyecto o sobre tus datos.</p>`;
  renderQuestion();
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));const indexes=visibleQuestionIndexes();if(!indexes.includes(currentIndex))currentIndex=indexes[0]??0;renderQuestion();}));
$("prevBtn").addEventListener("click",()=>{currentIndex=Math.max(0,currentIndex-1);renderQuestion();});
$("nextBtn").addEventListener("click",()=>{currentIndex=Math.min(19,currentIndex+1);renderQuestion();});
$("skipBtn").addEventListener("click",()=>{const indexes=visibleQuestionIndexes();const pos=indexes.indexOf(currentIndex);currentIndex=indexes[Math.min(pos+1,indexes.length-1)]??currentIndex;renderQuestion();});
$("credit").addEventListener("change",()=>{$("preferredWrap").hidden=$("credit").value!=="preferred";});

window.onTurnstileLoad=function(){
  if(!window.turnstile||turnstileWidgetId!==null)return;
  turnstileWidgetId=window.turnstile.render("#turnstileWidget",{sitekey:TURNSTILE_SITE_KEY,
    callback:token=>{turnstileToken=token;refreshSubmitState();setUploadStatus("");},
    "expired-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus("La verificación ha caducado. Vuelve a verificarte.");},
    "error-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus("No se ha podido completar la verificación.");}
  });
};
function refreshSubmitState(){const hasClips=Object.keys(clips).length>0;$("submitBtn").disabled=!(hasClips&&turnstileToken);}
$("cameraBtn").addEventListener("click",async()=>{
  try{stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});$("preview").srcObject=stream;$("recordBtn").disabled=false;setStatus(t("cameraReady"));}
  catch(e){setStatus(t("cameraError"));}
});
$("recordBtn").addEventListener("click",()=>{
  if(!$("agree").checked||!$("adobeReleaseCompleted").checked||!$("legalName").value.trim()||!$("email").value.trim()||!$("dob").value){setStatus(t("needDetails"));return;}
  if(!adultFromDate($("dob").value)){setStatus(t("adultOnly"));return;}
  if(!stream)return;
  chunks=[];
  let mime="video/webm";
  if(MediaRecorder.isTypeSupported("video/webm;codecs=vp9"))mime="video/webm;codecs=vp9";
  else if(MediaRecorder.isTypeSupported("video/webm;codecs=vp8"))mime="video/webm;codecs=vp8";
  recorder=new MediaRecorder(stream,{mimeType:mime});
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  recorder.onstop=()=>{
    const type=(recorder.mimeType||"video/webm").split(";")[0];
    clips[currentIndex]=new Blob(chunks,{type});renderQuestion();refreshSubmitState();setStatus(t("saved"));
  };
  recorder.start();$("recordBtn").disabled=true;$("stopBtn").disabled=false;setStatus(t("recording"));
});
$("stopBtn").addEventListener("click",()=>{if(recorder&&recorder.state!=="inactive"){recorder.stop();$("recordBtn").disabled=false;$("stopBtn").disabled=true;}});
$("submitBtn").addEventListener("click",async()=>{
  setUploadStatus("");
  const legalName=$("legalName").value.trim(),email=$("email").value.trim(),dob=$("dob").value;
  const credit=$("credit").value,preferredName=$("preferredName").value.trim();
  if(!legalName||!email||!dob||!$("agree").checked){setUploadStatus(t("needDetails"));return;}
  if(!$("adobeReleaseCompleted").checked){setUploadStatus(t("needRelease"));return;}
  if(!adultFromDate(dob)){setUploadStatus(t("adultOnly"));return;}
  if(credit==="preferred"&&!preferredName){setUploadStatus(t("needPreferred"));return;}
  if(!turnstileToken){setUploadStatus(t("needTurnstile"));return;}
  const keys=Object.keys(clips).map(Number).sort((a,b)=>a-b);
  if(!keys.length){setUploadStatus(t("noClips"));return;}
  const data=new FormData();
  data.set("legalName",legalName);data.set("email",email);data.set("dob",dob);
  data.set("consent","true");data.set("adobeReleaseDeclared","true");
  data.set("credit",credit);data.set("preferredName",preferredName);data.set("turnstileToken",turnstileToken);
  data.set("language",lang);
  keys.forEach(k=>{const blob=clips[k];const ext=blob.type==="video/mp4"?"mp4":"webm";data.set(`answer${k+1}`,blob,`question-${String(k+1).padStart(2,"0")}.${ext}`);});
  $("submitBtn").disabled=true;setUploadStatus(t("sending"));
  try{
    const response=await fetch(`${API_BASE}/api/submissions`,{method:"POST",body:data});
    const result=await response.json().catch(()=>({}));
    if(response.status===503){setUploadStatus(t("serviceOff"));return;}
    if(!response.ok){setUploadStatus(result.error||t("failed"));if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);turnstileToken="";return;}
    setUploadStatus(t("received")+result.submissionId);
  }catch(e){setUploadStatus(t("connectionError"));}
  finally{refreshSubmitState();}
});
window.addEventListener("beforeunload",()=>{if(stream)stream.getTracks().forEach(track=>track.stop());});
applyLanguage();
showStep(0);
