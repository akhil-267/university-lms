// Start here: this user’s navigation, data scope, action handlers and form handlers.
const visibleCourses = () =>
  db.courses.filter((c) => c.faculty === names.faculty);
const subjectAllowed = (s) => visibleCourses().some((c) => c.subject === s);
const published = () =>
  db.results.filter(
    (r) => r.status === "Published" && subjectAllowed(r.subject),
  );
const visibleExams = () => db.exams.filter((e) => subjectAllowed(e.subject));
const visibleResults = () =>
  db.results.filter((r) => subjectAllowed(r.subject));
const visibleAttempts = () =>
  db.attempts.filter((a) => subjectAllowed(a.exam.subject));

const roleMenu = [
  "dashboard",
  "courses",
  "students",
  "questions",
  "exams",
  "evaluation",
  "results",
  "analytics",
  "reports",
];
const roleViews = {
  dashboard,
  courses: coursesView,
  students: studentsView,
  questions: questionsView,
  exams: examList,
  evaluation: evaluations,
  results: resultsView,
  analytics,
  reports,
};
const roleActions = {
  add: () => questionForm(),
  edit: questionForm,
  "create-exam": createExam,
  details: instructions,
  evaluate: evaluationForm,
  publish: confirmPublication,
};
const roleForms = {
  record: (data) => saveRecord(data, ["questions"], validateQuestion),
  "exam-create": createExamination,
  "mark-attempt": approveEvaluation,
  "publish-result": publishResult,
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
  if (page === "questions")
    return btn("+ Add question", "add", "", "btn-primary");
  if (page === "exams")
    return btn("+ Create examination", "create-exam", "", "btn-primary");
  return "";
}
