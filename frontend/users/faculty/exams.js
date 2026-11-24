// Faculty: examination list, instructions and authoring.
function examTable(ex) {
  return table(
    ["Examination", "Availability", "Status", "Action"],
    ex.map((e) => {
      const a = db.attempts.find(
        (a) => a.exam.id === e.id && a.student === "s1",
      );
      return [
        `<b>${esc(e.title)}</b><span class="secondary">${esc(e.subject)} · ${e.duration} min · ${examMax(e)} marks</span>`,
        fmt(e.start) + '<span class="secondary">to ' + fmt(e.end) + "</span>",
        badge(a ? a.state : e.status),
        btn("View details", "details", e.id, "btn-sm"),
      ];
    }),
  );
}
function examList() {
  return panel("All examinations", examTable(visibleExams()));
}

function examMax(e) {
  return e.questionIds.reduce(
    (n, id) => n + (db.questions.find((q) => q.id === id)?.marks || 0),
    0,
  );
}
function instructions(examId) {
  const e = visibleExams().find((e) => e.id === examId);
  if (!e) return;
  modal(
    "Examination details",
    `<h3>${esc(e.title)}</h3><p>${esc(e.instructions)}</p><p>${e.duration} minutes · ${examMax(e)} marks · Passing marks: ${e.passing}</p><p>Assigned students: ${e.assigned.length}</p><p>Available ${esc(new Date(e.start).toLocaleString())} to ${esc(new Date(e.end).toLocaleString())}</p>`,
    "Close",
    "dismiss",
  );
}
function createExam() {
  const qs = db.questions.filter((q) => subjectAllowed(q.subject));
  if (!qs.length) {
    toast("Add questions before creating an examination.");
    return;
  }
  const now = new Date(),
    later = new Date(Date.now() + 86400000);
  const local = (d) =>
    new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  modal(
    "Create examination",
    `<div class="form-grid">${field("Examination title", "title")}${select(
      "Subject",
      "subject",
      visibleCourses().map((c) => c.subject),
    )}${field("Duration (minutes)", "duration", "number", 30, 'min="1" max="240"')}${field("Passing marks", "passing", "number", 10, 'min="0"')}${field("Opens at", "start", "datetime-local", local(now))}${field("Closes at", "end", "datetime-local", local(later))}${textarea("Instructions", "instructions", "Read all questions carefully. Save and review before submitting.", "required")}<fieldset class="full"><legend style="font-size:14px;font-weight:600">Select questions</legend>${qs.map((q) => `<label class="answer-option"><input name="questionIds" type="checkbox" value="${q.id}" checked><span>${esc(q.text)} <small>(${q.marks} marks · ${esc(q.subject)})</small></span></label>`).join("")}</fieldset><fieldset class="full"><legend style="font-size:14px;font-weight:600">Assign students</legend>${db.students
      .filter((s) => s.status === "Active")
      .map(
        (s) =>
          `<label class="answer-option"><input type="checkbox" name="assigned" value="${s.id}" checked>${esc(s.name)}</label>`,
      )
      .join("")}</fieldset></div>`,
    "Create and assign",
    "exam-create",
  );
}
function createExamination(data, fd) {
  if (role !== "faculty") return;
  const qids = fd.getAll("questionIds"),
    assigned = fd.getAll("assigned"),
    qs = qids.map((qid) => db.questions.find((q) => q.id === qid));
  if (!qids.length || !assigned.length)
    return error("Choose at least one question and one student.");
  if (qs.some((q) => q.subject !== data.subject))
    return error("All selected questions must belong to the selected subject.");
  const max = qs.reduce((s, q) => s + q.marks, 0),
    passing = Number(data.passing),
    duration = Number(data.duration);
  if (Date.parse(data.end) <= Date.parse(data.start))
    return error("Closing time must be after opening time.");
  if (!Number.isFinite(passing) || passing < 0 || passing > max)
    return error("Passing marks must be between 0 and " + max + ".");
  if (!Number.isFinite(duration) || duration <= 0)
    return error("Duration must be positive.");
  db.exams.push({
    id: id(),
    title: data.title.trim(),
    subject: data.subject,
    duration,
    passing,
    start: new Date(data.start).toISOString(),
    end: new Date(data.end).toISOString(),
    instructions: data.instructions.trim(),
    questionIds: qids,
    assigned,
    status: "Scheduled",
  });
  if (!persist()) return;
  $("#modal").close();
  render();
  toast("Examination created and assigned.");
  return;
}
