// Faculty only: answer review, manual marks, feedback and approval.
function evaluations() {
  const list = visibleAttempts().filter((a) => a.state !== "In progress");
  return panel(
    "Submitted attempts",
    table(
      ["Student", "Examination", "Submitted", "Status", "Action"],
      list.map((a) => [
        esc(db.students.find((s) => s.id === a.student)?.name || "Student"),
        esc(a.exam.title),
        fmt(a.submittedAt),
        badge(
          db.results.some((r) => r.attempt === a.id)
            ? "Evaluated"
            : "Awaiting marking",
        ),
        btn("Review answers", "evaluate", a.id, "btn-sm"),
      ]),
    ),
  );
}

function evaluationForm(attemptId) {
  const a = visibleAttempts().find((a) => a.id === attemptId);
  if (!a || role !== "faculty") return;
  const done = db.results.some((r) => r.attempt === a.id);
  modal(
    "Evaluate submission",
    `<input type="hidden" name="attempt" value="${a.id}"><p>${esc(a.exam.title)} · ${esc(db.students.find((s) => s.id === a.student)?.name)}</p>${a.questions.map((q, i) => `<div class="panel-body"><h3>${i + 1}. ${esc(q.text)}</h3><p><b>Response:</b> ${esc(a.answers[q.id] || "No answer")}</p>${["MCQ", "True/False"].includes(q.type) ? `<p>Automatic marks: ${a.marks[q.id]}/${q.marks}</p>` : field("Marks (maximum " + q.marks + ")", "marks-" + q.id, "number", a.marks[q.id] ?? "", 'min="0" max="' + q.marks + '" step="0.5"') + textarea("Feedback", "feedback-" + q.id, a.feedback?.[q.id] || "")}</div>`).join("")}<div class="notice">${done ? "This attempt already has a result. Corrections require a backend revision workflow; this demo does not change released results." : "Short answers are marked manually in this demo. Confirm the marking policy before backend implementation."}</div>`,
    "Approve result",
    "mark-attempt",
  );
  if (done) $('#mark-attempt button[type="submit"]').disabled = true;
}
function approveEvaluation(data, fd) {
  if (role !== "faculty") return;
  const a = visibleAttempts().find((a) => a.id === data.attempt);
  if (
    !a ||
    a.state === "In progress" ||
    db.results.some((r) => r.attempt === a.id)
  )
    return error("This submission cannot be evaluated again.");
  const marks = { ...a.marks },
    feedback = {};
  for (const q of a.questions) {
    if (!["MCQ", "True/False"].includes(q.type)) {
      const n = Number(data["marks-" + q.id]);
      if (!Number.isFinite(n) || n < 0 || n > q.marks)
        return error("Enter valid marks for every manually evaluated answer.");
      marks[q.id] = n;
      feedback[q.id] = data["feedback-" + q.id];
    }
  }
  a.marks = marks;
  a.feedback = feedback;
  const max = a.questions.reduce((s, q) => s + q.marks, 0),
    total = Object.values(marks).reduce((s, n) => s + n, 0);
  db.results.push({
    id: id(),
    attempt: a.id,
    student: a.student,
    name: db.students.find((s) => s.id === a.student)?.name || "Student",
    exam: a.exam.title,
    subject: a.exam.subject,
    marks: total,
    max,
    status: "Approved",
    date: new Date().toISOString(),
  });
  if (!persist()) return;
  $("#modal").close();
  render();
  toast("Evaluation approved. Publish it from Results.");
  return;
}
