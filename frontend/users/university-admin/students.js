// University Admin: edit students table columns and registration fields here.
function studentsView() {
  return renderRecords(
    db.students,
    ["Name / email", "ID", "Department", "Course", "Status"],
    (r) => [
      `<b>${esc(r.name)}</b><span class="secondary">${esc(r.email)}</span>`,
      esc(r.code),
      esc(r.department),
      esc(r.course),
      badge(r.status),
    ],
    true,
  );
}
function studentsForm(recordId) {
  showRecordForm(
    "students",
    recordId,
    "student",
    (r) =>
      field("Full name", "name", "text", r.name || "") +
      field("Email address", "email", "email", r.email || "") +
      field("Roll number", "code", "text", r.code || "") +
      select(
        "Department",
        "department",
        db.academic.filter((x) => x.type === "Department").map((x) => x.name),
        r.department,
      ) +
      select(
        "Course",
        "course",
        [...new Set(db.courses.map((c) => c.name))],
        r.course,
      ) +
      select(
        "Account status",
        "status",
        ["Active", "Inactive"],
        r.status || "Active",
      ),
  );
}
