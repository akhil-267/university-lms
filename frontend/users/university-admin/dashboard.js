// University Admin dashboard cards, panels and welcome content.
function dashboard() {
  const rs = published(),
    ex = visibleExams(),
    pending = visibleAttempts().filter(
      (a) =>
        a.state !== "In progress" &&
        !db.results.some((r) => r.attempt === a.id),
    );
  const cards =
    stat("Total students", db.students.length, "Current university") +
    stat("Total faculty", db.faculty.length, "Current academic year") +
    stat("Examinations", ex.length, "Across your academic scope") +
    stat("Pending evaluations", pending.length, "Submitted attempts");
  return overviewLayout(
    "Welcome back, Ananya.",
    cards,
    panel("Examination overview", examTable(ex.slice(0, 4))) +
      panel(
        "Performance snapshot",
        `<div class="panel-body">${barChart(rs)}<p class="chart-caption">Mean published percentage by subject</p></div>`,
      ),
    panel(
      "Scheduled examinations",
      `<div class="panel-body">${
        ex
          .filter((e) => e.status === "Scheduled")
          .map(
            (e) =>
              `<div class="schedule-item"><div><h3>${esc(e.title)}</h3><p>Closes ${fmt(e.end)} · ${e.duration} minutes</p></div></div>`,
          )
          .join("") || "<p>No scheduled examinations.</p>"
      }</div>`,
    ),
  );
}
