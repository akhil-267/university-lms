// University-Admin: examination list, instructions.
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
