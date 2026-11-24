// University Admin: edit academic table columns and registration fields here.
function academicView() {
  return renderRecords(
    db.academic,
    ["Record", "Type", "Code"],
    (r) => [esc(r.name), esc(r.type), esc(r.code)],
    true,
  );
}
function academicForm(recordId) {
  showRecordForm(
    "academic",
    recordId,
    "Academic structure",
    (r) =>
      select(
        "Record type",
        "type",
        ["Department", "Academic year", "Semester"],
        r.type,
      ) +
      field("Name", "name", "text", r.name || "") +
      field("Code", "code", "text", r.code || ""),
  );
}
