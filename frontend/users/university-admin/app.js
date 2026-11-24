// Start here: this user’s navigation, data scope, action handlers and form handlers.
const published = () => db.results.filter((r) => r.status === "Published");
const visibleCourses = () => db.courses;
const subjectAllowed = () => true;
const visibleExams = () => db.exams;
const visibleResults = () => db.results;
const visibleAttempts = () => db.attempts;
const recordForms = {
  academic: academicForm,
  students: studentsForm,
  faculty: facultyForm,
  courses: coursesForm,
};
const roleMenu = [
  "dashboard",
  "academic",
  "students",
  "faculty",
  "courses",
  "exams",
  "analytics",
  "reports",
];
const roleViews = {
  dashboard,
  academic: academicView,
  students: studentsView,
  faculty: facultyView,
  courses: coursesView,
  exams: examList,
  analytics,
  reports,
};
const roleActions = {
  add: () => recordForms[page]?.(),
  edit: (value) => recordForms[page]?.(value),
  status: (value) =>
    ["students", "faculty"].includes(page) && toggleStatus(page, value),
  details: instructions,
};
const roleForms = {
  record: (data) =>
    saveRecord(data, ["academic", "students", "faculty", "courses"]),
};
const roleHooks = {
  change: (event) => {
    if (event.target.name === "reportType") {
      reportType = event.target.value;
      render();
    }
    if (event.target.name === "reportSubject") {
      reportSubject = event.target.value;
      render();
    }
  },
};
function pageActions() {
  if (page === "reports")
    return (
      btn("Print / Save as PDF", "print") +
      btn("Export CSV", "csv", "", "btn-primary")
    );
  const label = {
    academic: "academic record",
    students: "student",
    faculty: "faculty",
    courses: "subject",
  }[page];
  if (label) return btn("+ Add " + label, "add", "", "btn-primary");
  return "";
}
