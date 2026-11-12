const questions = [
  "What does intimacy mean to you?",
  "When do you feel most seen?",
  "What are you looking for when you enter a space like this?",
  "Is there a difference between desire and loneliness?",
  "Have you ever felt that you had to hide a part of yourself?",
  "What makes a place feel safe enough to be vulnerable?",
  "What do you think people misunderstand about cruising?",
  "If you could leave one thought here, what would it be?"
];

const $ = (id) => document.getElementById(id);
const consentPanel = $("consent-panel");
const recordingPanel = $("recording-panel");
const preview = $("preview");
const cameraPlaceholder = $("camera-placeholder");
const recIndicator = $("rec-indicator");
const timerDisplay = $("timer");
const startButton = $("start-button");
const stopButton = $("stop-button");
const downloadArea = $("download-area");
const downloadLink = $("download-link");

let stream = null;
let recorder = null;
let chunks = [];
let timerInterval = null;
let seconds = 0;
let questionIndex = 0;
let currentUrl = null;

function updateQuestion() {
  $("question-text").textContent = questions[questionIndex];
  $("question-count").textContent = `${String(questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  $("previous-button").disabled = questionIndex === 0;
  $("next-button").textContent = questionIndex === questions.length - 1 ? "FINISH QUESTIONS →" : "NEXT QUESTION →";
}

function formatTime(value) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function stopTracks() {
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  preview.srcObject = null;
  cameraPlaceholder.hidden = false;
  $("camera-status").textContent = "CAMERA OFF";
}

$("age-check").addEventListener("change", validateConsent);
$("consent-check").addEventListener("change", validateConsent);
function validateConsent() {
  $("enter-button").disabled = !($("age-check").checked && $("consent-check").checked);
}

$("enter-button").addEventListener("click", async () => {
  $("consent-error").textContent = "";
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera access requires a secure connection (HTTPS) and a supported browser.");
    }
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    preview.srcObject = stream;
    cameraPlaceholder.hidden = true;
    $("camera-status").textContent = "CAMERA & MICROPHONE READY";
    consentPanel.hidden = true;
    recordingPanel.hidden = false;
    updateQuestion();
  } catch (error) {
    $("consent-error").textContent = error.message || "Could not access your camera or microphone. Check your browser permissions.";
  }
});

startButton.addEventListener("click", () => {
  if (!stream) return;
  const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(type => MediaRecorder.isTypeSupported(type));
  try {
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  } catch {
    $("recording-message").textContent = "Recording is not supported by this browser.";
    return;
  }
  chunks = [];
  recorder.addEventListener("dataavailable", event => {
    if (event.data && event.data.size) chunks.push(event.data);
  });
  recorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(blob);
    downloadLink.href = currentUrl;
    downloadLink.download = `sunday-at-church-question-${String(questionIndex + 1).padStart(2, "0")}.webm`;
    downloadArea.hidden = false;
    $("recording-message").textContent = "Recording created locally. Download it before moving to another question.";
  });
  recorder.start(1000);
  seconds = 0;
  timerDisplay.textContent = "00:00";
  timerInterval = setInterval(() => {
    seconds += 1;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
  recIndicator.hidden = false;
  $("camera-status").textContent = "RECORDING IN PROGRESS";
  downloadArea.hidden = true;
  $("recording-message").textContent = "Recording in this browser. Press STOP when you have finished your answer.";
});

stopButton.addEventListener("click", stopRecording);
function stopRecording() {
  if (recorder && recorder.state !== "inactive") recorder.stop();
  clearInterval(timerInterval);
  startButton.disabled = false;
  stopButton.disabled = true;
  recIndicator.hidden = true;
  $("camera-status").textContent = "RECORDING STOPPED";
}

$("retake-button").addEventListener("click", () => {
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = null;
  downloadArea.hidden = true;
  $("recording-message").textContent = "Your previous take has been discarded from this page. Record a new answer when ready.";
});

$("previous-button").addEventListener("click", () => {
  if (recorder && recorder.state !== "inactive") return;
  if (questionIndex > 0) {
    questionIndex -= 1;
    updateQuestion();
    downloadArea.hidden = true;
  }
});

$("next-button").addEventListener("click", () => {
  if (recorder && recorder.state !== "inactive") return;
  if (downloadArea.hidden && $("recording-message").textContent.includes("Download it")) {
    $("recording-message").textContent = "Please download or discard your current answer before continuing.";
    return;
  }
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    updateQuestion();
    downloadArea.hidden = true;
    $("recording-message").textContent = "Your recording stays in this browser until you download it.";
  } else {
    $("recording-message").textContent = "You've reached the end of the questions. You can finish the session below.";
  }
});

$("finish-button").addEventListener("click", () => {
  if (recorder && recorder.state !== "inactive") stopRecording();
  stopTracks();
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  recordingPanel.hidden = true;
  consentPanel.hidden = false;
  $("age-check").checked = false;
  $("consent-check").checked = false;
  validateConsent();
  $("consent-error").textContent = "Your camera and microphone have been turned off. Remember to keep any downloaded recordings somewhere secure.";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("beforeunload", () => {
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  if (stream) stream.getTracks().forEach(track => track.stop());
});
