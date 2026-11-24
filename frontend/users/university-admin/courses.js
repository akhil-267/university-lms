// University Admin: edit courses table columns and registration fields here.
function coursesView() {
  return renderRecords(
    db.courses,
    ["Subject", "Course", "Code", "Semester", "Faculty"],
    (r) => [
      esc(r.subject),
      esc(r.name),
      esc(r.code),
      esc(r.semester),
      esc(r.faculty),
    ],
    true,
  );
}
function coursesForm(recordId) {
  showRecordForm(
    "courses",
    recordId,
    "subject",
    (r) =>
      field("Course name", "name", "text", r.name || "") +
      field("Subject name", "subject", "text", r.subject || "") +
      field("Subject code", "code", "text", r.code || "") +
      select(
        "Semester",
        "semester",
        db.academic.filter((x) => x.type === "Semester").map((x) => x.name),
        r.semester,
      ) +
      select(
        "Assigned faculty",
        "faculty",
        db.faculty.map((f) => f.name),
        r.faculty,
      ),
  );
}
