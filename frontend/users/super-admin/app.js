// Start here: this user’s navigation, data scope, action handlers and form handlers.
const published = () => [];
const visibleCourses = () => [];
const subjectAllowed = () => false;
const visibleExams = () => [];
const visibleResults = () => [];
const visibleAttempts = () => [];

const roleMenu = ["dashboard", "universities", "reports"];
const roleViews = { dashboard, universities: universitiesView, reports };
const roleActions = {
  add: () => universityForm(),
  edit: (value) => universityForm(value),
  status: (value) => toggleStatus("universities", value),
};
const roleForms = { record: (data) => saveRecord(data, ["universities"]) };
const roleHooks = {};
function pageActions() {
  if (page === "reports")
    return (
      btn("Print / Save as PDF", "print") +
      btn("Export CSV", "csv", "", "btn-primary")
    );
  if (page === "universities")
    return btn("+ Add university", "add", "", "btn-primary");
  return "";
}
