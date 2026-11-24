// Student dashboard cards and panels.
function dashboard() {
  const rs = published(),
    ex = visibleExams(),
    avg = rs.length
      ? Math.round(rs.reduce((sum, r) => sum + pct(r), 0) / rs.length)
      : null;
  const cards =
    stat("Assigned courses", visibleCourses().length, "Current semester") +
    stat("Assigned examinations", ex.length, "Scheduled assessments") +
    stat("Published results", rs.length, "Available to review") +
    stat(
      "Average performance",
      avg === null ? "—" : avg + "%",
      "Mean of published percentages",
    );
  return overviewLayout(
    "Ready for your next milestone?",
    cards,
    panel("Your examinations", examTable(ex)) +
      panel("Your progress", `<div class="panel-body">${barChart(rs)}</div>`),
    panel(
      "Your next steps",
      '<div class="panel-body"><p>Read examination instructions, save your answers and review your published results.</p><a class="btn btn-primary" href="#exams">View examinations</a></div>',
    ),
  );
}
