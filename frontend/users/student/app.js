// Start here: this user’s navigation, data scope, action handlers and form handlers.
const visibleCourses = () => db.courses;
const subjectAllowed = () => true;
const published = () =>
  db.results.filter((r) => r.status === "Published" && r.student === "s1");
const visibleExams = () =>
  db.exams.filter((e) => e.assigned.includes("s1") && e.status !== "Draft");
const visibleResults = published;
const visibleAttempts = () => db.attempts.filter((a) => a.student === "s1");

const roleMenu = [
  "dashboard",
  "courses",
  "exams",
  "results",
  "analytics",
  "reports",
  "profile",
];
const roleViews = {
  dashboard,
  courses: coursesView,
  exams: examList,
  attempt: attemptView,
  results: resultsView,
  analytics,
  reports,
  profile,
};
const roleActions = {
  instructions,
  next: () => {
    questionIndex++;
    render();
  },
  previous: () => {
    questionIndex--;
    render();
  },
  jump: (value) => {
    const a = activeAttempt();
    if (a && Number(value) >= 0 && Number(value) < a.questions.length) {
      questionIndex = Number(value);
      render();
    }
  },
  "confirm-submit": () => {
    const a = activeAttempt();
    if (a)
      modal(
        "Submit examination?",
        `<p>You have answered ${Object.values(a.answers).filter(Boolean).length} of ${a.questions.length} questions. After submission, answers cannot be changed.</p>`,
        "Submit examination",
        "submit-attempt",
      );
  },
};
const roleForms = {
  "start-exam": startExamination,
  "submit-attempt": submitExamination,
};
const roleHooks = {
  change: (event) => {
    if (event.target.matches("input[data-question]")) saveAnswer(event.target);
    if (event.target.name === "reportType") {
      reportType = event.target.value;
      render();
    }
    if (event.target.name === "reportSubject") {
      reportSubject = event.target.value;
      render();
    }
  },
  input: (event) => {
    if (event.target.matches("textarea[data-question]"))
      saveAnswer(event.target);
  },
  tick: () => {
    let expired = false;
    visibleAttempts()
      .filter((a) => a.state === "In progress" && Date.now() >= a.deadline)
      .forEach((a) => {
        finalize(a, "timeout");
        expired = true;
      });
    if (!expired && page === "attempt") {
      const a = activeAttempt();
      if (a && $("#timer")) $("#timer").textContent = remaining(a);
    }
  },
};
function pageActions() {
  if (page === "reports")
    return (
      btn("Print / Save as PDF", "print") +
      btn("Export CSV", "csv", "", "btn-primary")
    );
  return "";
}
