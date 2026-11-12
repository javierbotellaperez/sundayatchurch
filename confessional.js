const $ = (id) => document.getElementById(id);
const API_BASE = "https://sundayatchurch-api.hi-d37.workers.dev";
const TURNSTILE_SITE_KEY = "0x4AAAAAAF-g4KWyfvHl1wnb";

const questionBank = {
  en: [
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
  ],
  es: [
    {section:"LA CONFESIÓN", type:"core", text:"Ave María Purísima. La última vez que fui a una sauna fue…", hint:"Cuenta hace cuánto tiempo. Puede ser ayer, hace cinco años o la primera y última vez que fuiste."},
    {section:"LA PRIMERA VEZ", type:"core", text:"¿Qué esperabas encontrar la primera vez que fuiste a una sauna?", hint:"Piensa en lo que imaginabas antes de entrar."},
    {section:"LA PRIMERA VEZ", type:"core", text:"¿Cómo fue la experiencia en comparación con lo que esperabas?", hint:"¿Hubo algo que te sorprendiera?"},
    {section:"LA PRIMERA VEZ", type:"extra", text:"¿Cambió tu percepción de las saunas después de conocerlas?", hint:"Puedes hablar del espacio, su ambiente o su funcionamiento."},
    {section:"DESEO Y PERTENENCIA", type:"core", text:"¿Por qué vas o por qué ibas a las saunas?", hint:"Puede haber más de una razón."},
    {section:"DESEO Y PERTENENCIA", type:"core", text:"¿Qué encuentras en una sauna que quizá no encuentras en otros lugares?", hint:"Si quieres, piensa más allá de lo evidente."},
    {section:"DESEO Y PERTENENCIA", type:"extra", text:"¿Crees que vas exclusivamente por sexo o hay algo más?", hint:"No hay una respuesta esperada."},
    {section:"DESEO Y PERTENENCIA", type:"extra", text:"¿Has ido alguna vez a una sauna sin tener necesariamente ganas de practicar sexo? ¿Por qué?", hint:"Cuéntanos qué te llevó allí."},
    {section:"EL MUNDO DIGITAL", type:"core", text:"¿Crees que las aplicaciones y el internet han desplazado a las saunas a un segundo plano?", hint:"Puedes estar de acuerdo, en desacuerdo o sentir ambas cosas."},
    {section:"EL MUNDO DIGITAL", type:"extra", text:"¿Qué ofrecen las saunas que internet no puede ofrecer?", hint:"Piensa en la presencia física, el anonimato, los encuentros casuales u otra cosa."},
    {section:"EL MUNDO DIGITAL", type:"extra", text:"¿Por qué crees que la gente sigue yendo a las saunas?", hint:"¿Qué crees que busca la gente cuando entra?"},
    {section:"RECUERDOS", type:"core", text:"¿Hay alguna experiencia en una sauna que recuerdes especialmente?", hint:"Puede ser divertida, tierna, incómoda, cotidiana o inesperada."},
    {section:"RECUERDOS", type:"extra", text:"¿Alguna vez te ha sorprendido algo que hayas vivido allí?", hint:"Un momento, una persona, una sensación o una situación."},
    {section:"RECUERDOS", type:"extra", text:"¿Hay algo que hayas vivido en una sauna y que nunca hayas contado a nadie?", hint:"Comparte solo aquello con lo que te sientas cómodo."},
    {section:"EL RITUAL", type:"core", text:"¿Crees que ir a una sauna tiene algo casi ritual?", hint:"Piensa en las rutinas, la repetición, la anticipación o la sensación de entrar en otro mundo."},
    {section:"EL RITUAL", type:"extra", text:"¿Qué crees que busca la gente cuando entra en una sauna?", hint:"Puede ser distinto de lo que dicen que están buscando."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"core", text:"¿Qué le dirías a alguien que nunca ha ido a una sauna y se está preparando para su primera vez?", hint:"Imagina que hablas con un amigo antes de su primera vez."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"Describe una sauna en tres palabras.", hint:"Las primeras palabras que te vengan a la cabeza."},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"¿Crees que las saunas están desapareciendo o que todavía ofrecen algo que necesitamos?", hint:"¿Qué podríamos perder si estos espacios desaparecieran?"},
    {section:"LAS ÚLTIMAS PALABRAS", type:"extra", text:"¿Hay algo que no te haya preguntado y que te gustaría confesar?", hint:"Este es tu espacio. Puedes llevar la conversación a otro lugar."}
  ]
};

const copy = {
  en:{
    back:"← BACK TO THE ENTRANCE",guiltIntro:"Throughout history, the Church has often framed desire and sexuality through the language of sin and guilt. This project borrows the ritual of confession as a way of letting go of the shame we may have been taught to carry. This is not a religious confession, and there is no judgement here — only a space to speak freely, in your own words.",windowTitle:"Sunday At Church.exe — The Confessional",eyebrow:"PHASE 01 / THE CONFESSIONAL",confTitle:"Welcome to the Confessional.",confIntro:"A place to leave a thought, a memory or a confession about sauna culture. You don't need to be a regular. You just need a story.",
    phaseOneTitle:"The Confessional",phaseOneText:"An open collection of personal testimonies, memories and perspectives. This first phase is about listening to as many different voices as possible.",phaseOneTag:"YOU ARE HERE",phaseTwoTitle:"The Conversation",phaseTwoText:"Some contributors may later be invited to a more in-depth, one-to-one filmed interview. Taking part now does not guarantee an invitation.",phaseTwoTag:"A POSSIBLE NEXT STEP",introNote:"The first phase is not a casting call. Your testimony matters on its own.",
    releaseWindowTitle:"01 — Participation & release",beforeBegin:"BEFORE YOU BEGIN",releaseTitle:"A quick formality.",releaseIntro:"Please complete the participation release through Adobe Sign before recording. Use the same legal name and email address in both places so the filmmaker can match them manually.",adobeTitle:"Sign your participation release",adobeIntro:"Choose the form in your preferred language. Adobe will send you a copy when the agreement is completed.",adobeCheck:"I have completed the Adobe Sign release.",adobeNote:"This checkbox is a declaration, not automatic proof of signature. Every submission remains pending until the filmmaker manually checks the signed PDF and the footage.",
    legalName:"Full legal name",email:"Email address",dob:"Date of birth",creditChoice:"How would you like to be credited?",creditFull:"Use my full name",creditPreferred:"Use a preferred name",creditNone:"Do not credit me",preferredName:"Preferred credit name",agree:"I confirm that I am 18 or older, participation is voluntary, and I have read the participation and privacy information.",
    recorderWindowTitle:"02 — Your confession",recordEyebrow:"YOUR TESTIMONY",recordTitle:"Whenever you're ready.",recordIntro:"Start with the opening confession. The ten core prompts are the shared thread; the extra questions are there if you feel like saying more. Skip anything you don't want to answer.",openingLabel:"THE OPENING CONFESSION",openingPrompt:"“Forgive me, Father, for I've sinned. The last time I went to a sauna was…”",openingSub:"It could have been yesterday, a few months ago, or five years ago. It might have been your first and last time.",questionBankLabel:"QUESTION BANK",filterAll:"ALL",filterCore:"CORE",filterExtra:"EXTRA",coreType:"CORE QUESTION",extraType:"OPTIONAL QUESTION",hintDefault:"There is no right or wrong answer.",enableCamera:"ENABLE CAMERA",startRecording:"START RECORDING",stopRecording:"STOP",previous:"← PREVIOUS",next:"NEXT →",skipQuestion:"SKIP THIS QUESTION",recording:"Recording…",saved:"Answer saved in this browser session.",cameraReady:"Camera and microphone ready.",cameraError:"Could not access camera or microphone. Check browser permissions.",recordNotice:"Camera access requires HTTPS or localhost.",uploadEyebrow:"03 / SEND YOUR CONFESSION",uploadTitle:"Ready to send?",uploadIntro:"You can submit any recorded answers. Your participation will remain pending until the filmmaker manually verifies both your Adobe release and the uploaded footage.",submitAnswers:"SUBMIT ANSWERS",noClips:"Record at least one answer before submitting.",needRelease:"Please confirm that you have completed the Adobe Sign release.",needDetails:"Please complete your name, email, date of birth and participation declaration.",adultOnly:"You must be 18 or older to participate.",needPreferred:"Please enter the name you want used in the credits.",needTurnstile:"Complete the security verification.",sending:"Sending your answers securely…",received:"Submission received. Your reference is: ",failed:"Submission failed. Please try again later.",serviceOff:"The submission service is currently unavailable.",connectionError:"Could not connect to the server. Your clips remain in this browser session.",closingNote:"Thank you for trusting us with your story. You can leave a question unanswered; silence is also an answer.",footerText:"THE CONFESSIONAL · PHASE 01"
  },
  es:{
    back:"← VOLVER A LA ENTRADA",guiltIntro:"A lo largo de la historia, la Iglesia ha abordado el deseo y la sexualidad en ocasiones desde el lenguaje del pecado y la culpa. Este proyecto toma prestado el ritual de la confesión como una forma de desprendernos de la vergüenza que quizá nos han enseñado a llevar con nosotros. No es una confesión religiosa ni un espacio de juicio: es, sencillamente, un lugar para hablar con libertad y con tus propias palabras.",windowTitle:"Sunday At Church.exe — El Confesionario",eyebrow:"FASE 01 / EL CONFESIONARIO",confTitle:"Bienvenido al Confesionario.",confIntro:"Un lugar para dejar un pensamiento, un recuerdo o una confesión sobre la cultura de las saunas. No hace falta que seas asiduo. Solo necesitas tener una historia.",
    phaseOneTitle:"El Confesionario",phaseOneText:"Una recopilación abierta de testimonios, recuerdos y perspectivas personales. Esta primera fase busca escuchar tantas voces diferentes como sea posible.",phaseOneTag:"ESTÁS AQUÍ",phaseTwoTitle:"La Conversación",phaseTwoText:"Más adelante, algunas personas participantes podrán ser invitadas a una entrevista individual filmada, más extensa y en profundidad. Participar ahora no garantiza una invitación.",phaseTwoTag:"UN POSIBLE SIGUIENTE PASO",introNote:"Esta primera fase no es un casting. Tu testimonio tiene valor por sí mismo.",
    releaseWindowTitle:"01 — Participación y autorización",beforeBegin:"ANTES DE EMPEZAR",releaseTitle:"Un pequeño trámite.",releaseIntro:"Completa la autorización de participación mediante Adobe Sign antes de grabar. Utiliza el mismo nombre legal y correo electrónico en ambos formularios para que el director pueda relacionarlos manualmente.",adobeTitle:"Firma la autorización de participación",adobeIntro:"Elige el formulario en el idioma que prefieras. Adobe te enviará una copia cuando el acuerdo esté completado.",adobeCheck:"He completado la autorización de Adobe Sign.",adobeNote:"Esta casilla es una declaración, no una prueba automática de la firma. Todas las participaciones quedarán pendientes hasta que el director compruebe manualmente el PDF firmado y los vídeos.",
    legalName:"Nombre legal completo",email:"Correo electrónico",dob:"Fecha de nacimiento",creditChoice:"¿Cómo quieres aparecer en los créditos?",creditFull:"Con mi nombre completo",creditPreferred:"Con un nombre elegido",creditNone:"No incluir mi nombre en los créditos",preferredName:"Nombre para los créditos",agree:"Confirmo que tengo 18 años o más, que mi participación es voluntaria y que he leído la información de participación y privacidad.",
    recorderWindowTitle:"02 — Tu confesión",recordEyebrow:"TU TESTIMONIO",recordTitle:"Cuando estés preparado.",recordIntro:"Empieza con la confesión inicial. Las diez preguntas principales forman el hilo común; las preguntas extra están ahí por si quieres contar algo más. Puedes saltarte cualquiera.",openingLabel:"LA CONFESIÓN INICIAL",openingPrompt:"«Ave María Purísima. La última vez que fui a una sauna fue…»",openingSub:"Puede haber sido ayer, hace unos meses o hace cinco años. Quizá fue tu primera y última vez.",questionBankLabel:"BANCO DE PREGUNTAS",filterAll:"TODAS",filterCore:"PRINCIPALES",filterExtra:"EXTRA",coreType:"PREGUNTA PRINCIPAL",extraType:"PREGUNTA OPCIONAL",hintDefault:"No hay respuestas correctas o incorrectas.",enableCamera:"ACTIVAR CÁMARA",startRecording:"EMPEZAR A GRABAR",stopRecording:"PARAR",previous:"← ANTERIOR",next:"SIGUIENTE →",skipQuestion:"SALTAR ESTA PREGUNTA",recording:"Grabando…",saved:"Respuesta guardada en esta sesión del navegador.",cameraReady:"Cámara y micrófono preparados.",cameraError:"No se pudo acceder a la cámara o al micrófono. Comprueba los permisos del navegador.",recordNotice:"El acceso a la cámara requiere HTTPS o localhost.",uploadEyebrow:"03 / ENVIAR TU CONFESIÓN",uploadTitle:"¿Lo enviamos?",uploadIntro:"Puedes enviar las respuestas que hayas grabado. Tu participación quedará pendiente hasta que el director verifique manualmente tanto la autorización de Adobe como los vídeos recibidos.",submitAnswers:"ENVIAR RESPUESTAS",noClips:"Graba al menos una respuesta antes de enviar.",needRelease:"Confirma que has completado la autorización de Adobe Sign.",needDetails:"Completa tu nombre, correo electrónico, fecha de nacimiento y declaración de participación.",adultOnly:"Debes tener 18 años o más para participar.",needPreferred:"Indica el nombre que quieres utilizar en los créditos.",needTurnstile:"Completa la verificación de seguridad.",sending:"Enviando tus respuestas de forma segura…",received:"Envío recibido. Tu referencia es: ",failed:"No se pudo completar el envío. Inténtalo de nuevo más tarde.",serviceOff:"El servicio de envío no está disponible en este momento.",connectionError:"No se pudo conectar con el servidor. Tus vídeos siguen en esta sesión del navegador.",closingNote:"Gracias por confiar en nosotros y compartir tu historia. Puedes dejar preguntas sin responder; el silencio también es una respuesta.",footerText:"EL CONFESIONARIO · FASE 01"
  }
};

let lang = localStorage.getItem("sac-lang") || "en";
let currentIndex = 0, stream = null, recorder = null, chunks = [], clips = {};
let turnstileToken = "", turnstileWidgetId = null, activeFilter = "all";

function t(key){return copy[lang][key] || key;}
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
    const a=document.createElement("a");a.href=URL.createObjectURL(existing);a.download=`sunday-at-church-question-${String(currentIndex+1).padStart(2,"0")}.webm`;a.textContent=`DOWNLOAD ANSWER ${currentIndex+1} ↓`;$("downloads").appendChild(a);
    setStatus(t("saved"));
  }else setStatus("");
}
function applyLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.textContent=copy[lang][key];});
  document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  $("adobeFormEn").hidden=lang!=="en";$("adobeFormEs").hidden=lang!=="es";
  $("releaseCopy").innerHTML=lang==="en"
    ? `<h3>Permission to record and use your contribution</h3><p>I give the production of <em>Sunday At Church</em> permission to record my image, voice and answers through this online Confessional, and to consider my contribution for inclusion in the documentary.</p><h3>Use of the documentary</h3><p>The intended uses may include educational screenings, film festivals, cinemas, cultural exhibitions, television, streaming, online distribution and promotional materials. My contribution may be edited, shortened, rearranged or subtitled, but should not knowingly be used in a materially misleading context.</p><h3>Voluntary participation and privacy</h3><p>My participation is voluntary and unpaid. I understand that the project explores intimacy, sexuality and queer community, and that appearing in it may reveal information about me. Any anonymity or credit restrictions should be agreed before recording. I may ask questions before participating.</p><h3>Privacy information</h3><p>Please read the separate privacy notice before submitting. You may contact <a href="mailto:hi@javierbotellaperez.com">hi@javierbotellaperez.com</a> with questions about this project or your information.</p>`
    : `<h3>Autorización para grabar y utilizar tu participación</h3><p>Autorizo a la producción de <em>Sunday At Church</em> a grabar mi imagen, mi voz y mis respuestas a través de este Confesionario online, y a valorar la inclusión de mi participación en el documental.</p><h3>Uso del documental</h3><p>Los usos previstos pueden incluir proyecciones educativas, festivales, salas de cine, exposiciones culturales, televisión, plataformas de streaming, distribución online y materiales promocionales. Mi participación podrá editarse, acortarse, reorganizarse o subtitularse, pero no debería utilizarse deliberadamente en un contexto materialmente engañoso.</p><h3>Participación voluntaria y privacidad</h3><p>Mi participación es voluntaria y no remunerada. Entiendo que el proyecto explora la intimidad, la sexualidad y la comunidad queer, y que aparecer en él puede revelar información sobre mí. Cualquier condición de anonimato o crédito deberá acordarse antes de grabar. Puedo hacer preguntas antes de participar.</p><h3>Información sobre privacidad</h3><p>Lee el aviso de privacidad independiente antes de enviar tu participación. Puedes escribir a <a href="mailto:hi@javierbotellaperez.com">hi@javierbotellaperez.com</a> si tienes preguntas sobre el proyecto o tus datos.</p>`;
  renderQuestion();
}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;localStorage.setItem("sac-lang",lang);applyLanguage();}));
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));const indexes=visibleQuestionIndexes();if(!indexes.includes(currentIndex))currentIndex=indexes[0]??0;renderQuestion();}));
$("prevBtn").addEventListener("click",()=>{currentIndex=Math.max(0,currentIndex-1);renderQuestion();});
$("nextBtn").addEventListener("click",()=>{currentIndex=Math.min(19,currentIndex+1);renderQuestion();});
$("skipBtn").addEventListener("click",()=>{const indexes=visibleQuestionIndexes();const pos=indexes.indexOf(currentIndex);currentIndex=indexes[Math.min(pos+1,indexes.length-1)]??currentIndex;renderQuestion();});
$("credit").addEventListener("change",()=>{$("preferredWrap").hidden=$("credit").value!=="preferred";});

window.onTurnstileLoad=function(){
  if(!window.turnstile||turnstileWidgetId!==null)return;
  turnstileWidgetId=window.turnstile.render("#turnstileWidget",{sitekey:TURNSTILE_SITE_KEY,
    callback:token=>{turnstileToken=token;refreshSubmitState();setUploadStatus("");},
    "expired-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus(lang==="es"?"La verificación ha caducado. Vuelve a verificarte.":"Verification expired. Please verify again.");},
    "error-callback":()=>{turnstileToken="";refreshSubmitState();setUploadStatus(lang==="es"?"No se pudo completar la verificación.":"Verification could not be completed.");}
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
