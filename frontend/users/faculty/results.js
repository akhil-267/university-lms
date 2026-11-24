// Faculty only: result approval display and publication.
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
        role === "faculty" && r.status !== "Published"
          ? btn("Publish", "publish", r.id, "btn-sm")
          : badge(r.status === "Published" ? "Released" : "Approved"),
      ]),
    ),
  );
}
function publishResult(data, fd) {
  if (role !== "faculty") return;
  const r = visibleResults().find((r) => r.id === data.result);
  if (!r || r.status !== "Approved") return;
  r.status = "Published";
  if (!persist()) return;
  $("#modal").close();
  render();
  toast("Result published to the student workspace.");
}
function confirmPublication(value) {
  {
    if (role !== "faculty") return;
    const r = visibleResults().find((r) => r.id === value);
    if (r && r.status === "Approved") {
      modal(
        "Publish result?",
        `<input type="hidden" name="result" value="${r.id}"><p>The result for ${esc(r.name)} in ${esc(r.exam)} will become visible in the student workspace.</p>`,
        "Publish result",
        "publish-result",
      );
    }
  }
}
