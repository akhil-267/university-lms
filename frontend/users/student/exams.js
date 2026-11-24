// Student: examination list, instructions.
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
        a && a.state !== "In progress"
          ? '<span class="section-note">Submitted</span>'
          : btn(
              a ? "Resume" : "View instructions",
              "instructions",
              e.id,
              "btn-sm",
            ),
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
  const e = db.exams.find((e) => e.id === examId);
  if (!e) return;
  const available =
    e.status === "Scheduled" &&
    Date.now() >= Date.parse(e.start) &&
    Date.now() < Date.parse(e.end) &&
    e.assigned.includes("s1");
  modal(
    role === "student" ? "Examination instructions" : "Examination details",
    `<input type="hidden" name="exam" value="${e.id}"><h3>${esc(e.title)}</h3><p>${esc(e.instructions)}</p><p>${e.duration} minutes · ${examMax(e)} marks · Passing marks: ${e.passing}</p><p>Available ${esc(new Date(e.start).toLocaleString())} to ${esc(new Date(e.end).toLocaleString())}</p><div class="notice">${role === "student" ? "This demo uses a browser timer and local storage. Real examination timing, eligibility and submission must be enforced by Laravel." : "Assigned students: " + e.assigned.length + ". Question content is snapshotted when the demo attempt starts."}</div>${available ? "" : '<p class="error">' + (role === "student" ? "This examination is not currently available." : "Details only. Students start through their own workspace.") + "</p>"}`,
    available ? "Start / resume examination" : "Close",
    available ? "start-exam" : "dismiss",
  );
}
