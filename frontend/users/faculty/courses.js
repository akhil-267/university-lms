// Faculty: course and subject display.
function coursesView() {
  return renderRecords(
    visibleCourses(),
    ["Subject", "Course", "Code", "Semester", "Faculty"],
    (r) => [
      esc(r.subject),
      esc(r.name),
      esc(r.code),
      esc(r.semester),
      esc(r.faculty),
    ],
  );
}
