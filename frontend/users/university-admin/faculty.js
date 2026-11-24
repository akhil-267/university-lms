// University Admin: edit faculty table columns and registration fields here.
function facultyView() {
  return renderRecords(
    db.faculty,
    ["Name / email", "ID", "Department", "Subject", "Status"],
    (r) => [
      `<b>${esc(r.name)}</b><span class="secondary">${esc(r.email)}</span>`,
      esc(r.code),
      esc(r.department),
      esc(r.subject),
      badge(r.status),
    ],
    true,
  );
}
function facultyForm(recordId) {
  showRecordForm(
    "faculty",
    recordId,
    "faculty member",
    (r) =>
      field("Full name", "name", "text", r.name || "") +
      field("Email address", "email", "email", r.email || "") +
      field("Employee ID", "code", "text", r.code || "") +
      select(
        "Department",
        "department",
        db.academic.filter((x) => x.type === "Department").map((x) => x.name),
        r.department,
      ) +
      select(
        "Subject",
        "subject",
        db.courses.map((c) => c.subject),
        r.subject,
      ) +
      select(
        "Account status",
        "status",
        ["Active", "Inactive"],
        r.status || "Active",
      ),
  );
}
