// Faculty: view the demonstration cohort. Enrollment changes belong to University Admin.
function studentsView() {
  return renderRecords(
    db.students,
    ["Student", "ID", "Department", "Course", "Status"],
    (r) => [
      esc(r.name),
      esc(r.code),
      esc(r.department),
      esc(r.course),
      badge(r.status),
    ],
  );
}
