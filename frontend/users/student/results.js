// Student only: display own published results. No evaluation or publication handlers.
function resultsView() {
  return panel(
    "Examination results",
    table(
      ["Student", "Examination", "Marks", "Percentage", "Status", "Action"],
      visibleResults().map((r) => [
        esc(r.name),
        `<b>${esc(r.exam)}</b><span class="secondary">${esc(r.subject)}</span>`,
        r.marks + " / " + r.max,
        pct(r) + "%",
        badge(r.status),
        badge(r.status === "Published" ? "Released" : "Approved"),
      ]),
    ),
  );
}
