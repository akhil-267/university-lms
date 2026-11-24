// Super Admin: university registry, registration and status controls.

function universitiesView() {
  return renderRecords(
    db.universities,
    ["University", "Code", "Status"],
    (r) => [esc(r.name), esc(r.code), badge(r.status)],
    true,
  );
}
function universityForm(recordId) {
  showRecordForm(
    "universities",
    recordId,
    "university",
    (r) =>
      field("University name", "name", "text", r.name || "") +
      field("University code", "code", "text", r.code || "") +
      select("Status", "status", ["Active", "Inactive"], r.status || "Active"),
  );
}
