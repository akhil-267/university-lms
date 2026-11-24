// Student only: start/resume, answers, browser timer and final submission. Server enforcement remains pending.
let questionIndex = 0;
function activeAttempt() {
  const aid = sessionStorage.getItem("lms-attempt");
  return db.attempts.find((a) => a.id === aid && a.student === "s1");
}

function attemptView() {
  const a = activeAttempt();
  if (!a || a.state !== "In progress") {
    page = "exams";
    return examList();
  }
  const q = a.questions[questionIndex] || a.questions[0];
  if (!q) return "<p>No questions are available.</p>";
  return `<div class="page-heading"><div><div class="eyebrow">Examination in progress</div><h1>${esc(a.exam.title)}</h1><p class="subtitle">Answers saved in this browser · Demo attempt</p></div>${btn("Submit examination", "confirm-submit", a.id, "btn-primary")}</div><div class="question-layout">${panel("Question " + (questionIndex + 1) + " of " + a.questions.length, `<div class="panel-body"><span class="badge gray">${esc(q.type)} · ${q.marks} marks</span><p class="question-text">${esc(q.text)}</p><div id="answer-control">${q.options.length ? q.options.map((o) => `<label class="answer-option"><input type="radio" name="answer" value="${esc(o)}" data-question="${q.id}" ${a.answers[q.id] === o ? "checked" : ""}>${esc(o)}</label>`).join("") : `<label class="field">Your answer<textarea data-question="${q.id}" name="answer" rows="6">${esc(a.answers[q.id] || "")}</textarea></label>`}</div><p class="section-note" id="save-status" role="status">${a.savedAt ? "Last saved " + new Date(a.savedAt).toLocaleTimeString() : "Your answers will save as you work."}</p><div class="actions">${questionIndex ? btn("Previous", "previous") : ""}${questionIndex < a.questions.length - 1 ? btn("Next question", "next", "", "btn-primary") : ""}</div></div>`)}<aside>${panel("Time remaining", `<div class="panel-body"><div class="timer" id="timer">${remaining(a)}</div><p class="section-note">Browser demo timer. Reloading does not reset your deadline.</p></div>`)}${panel("Question navigator", `<div class="panel-body"><div class="question-numbers">${a.questions.map((q, i) => `<button data-action="jump" data-id="${i}" class="${i === questionIndex ? "current" : ""} ${a.answers[q.id] ? "answered" : ""}" aria-label="Question ${i + 1}${a.answers[q.id] ? ", answered" : ""}">${i + 1}</button>`).join("")}</div><p class="section-note" style="margin-top:15px">Green indicates an answered question.</p></div>`)}</aside></div>`;
}

function remaining(a) {
  const sec = Math.max(0, Math.ceil((a.deadline - Date.now()) / 1000));
  return (
    String(Math.floor(sec / 60)).padStart(2, "0") +
    ":" +
    String(sec % 60).padStart(2, "0")
  );
}

function finalize(a, reason) {
  if (!a || a.state !== "In progress") return;
  a.state = reason === "timeout" ? "Timed out" : "Submitted";
  a.submittedAt = Date.now();
  a.marks = {};
  a.questions.forEach((q) => {
    if (["MCQ", "True/False"].includes(q.type))
      a.marks[q.id] = a.answers[q.id] === q.correct ? q.marks : 0;
  });
  if (!persist()) return;
  page = "exams";
  location.hash = "exams";
  render();
  toast(
    reason === "timeout"
      ? "Time ended. Saved answers have been submitted."
      : "Examination submitted. Your answers are ready for evaluation.",
  );
}

function saveAnswer(el) {
  const a = activeAttempt();
  if (
    role !== "student" ||
    page !== "attempt" ||
    !a ||
    a.state !== "In progress"
  )
    return;
  if (Date.now() >= a.deadline) {
    finalize(a, "timeout");
    return;
  }
  if (!a.questions.some((q) => q.id === el.dataset.question)) return;
  a.answers[el.dataset.question] = el.value;
  a.savedAt = Date.now();
  const ok = persist();
  const status = $("#save-status");
  if (status)
    status.textContent = ok
      ? "Saved in this browser at " + new Date(a.savedAt).toLocaleTimeString()
      : "Not saved. Browser storage is unavailable.";
}
function startExamination(data, fd) {
  if (role !== "student") return;
  const e = db.exams.find((e) => e.id === data.exam);
  if (
    !e ||
    !e.assigned.includes("s1") ||
    e.status !== "Scheduled" ||
    Date.now() < Date.parse(e.start) ||
    Date.now() >= Date.parse(e.end)
  )
    return error("This examination is no longer available.");
  let a = db.attempts.find((a) => a.exam.id === e.id && a.student === "s1");
  if (a && a.state !== "In progress")
    return error("This examination has already been submitted.");
  if (!a) {
    a = {
      id: id(),
      student: "s1",
      exam: structuredClone(e),
      questions: structuredClone(
        e.questionIds.map((q) => db.questions.find((x) => x.id === q)),
      ),
      answers: {},
      state: "In progress",
      startedAt: Date.now(),
      deadline: Math.min(Date.now() + e.duration * 60000, Date.parse(e.end)),
    };
    db.attempts.push(a);
    if (!persist()) return;
  }
  sessionStorage.setItem("lms-attempt", a.id);
  questionIndex = 0;
  $("#modal").close();
  page = "attempt";
  location.hash = "attempt";
  render();
  return;
}
function submitExamination() {
  const a = activeAttempt();
  $("#modal").close();
  finalize(a, "manual");
  return;
}
