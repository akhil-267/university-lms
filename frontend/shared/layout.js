// Shared navigation shell. Role menus, views, actions and forms are registered in each role app.js.
const roles = {
  super: "Super Admin",
  admin: "University Admin",
  faculty: "Faculty",
  student: "Student",
};
const names = {
  super: "Platform administrator",
  admin: "Ananya Rao",
  faculty: "Dr. Meera Nair",
  student: "Aarav Sharma",
};
const icons = {
  dashboard: "▦",
  universities: "◇",
  academic: "▤",
  students: "♙",
  faculty: "♧",
  courses: "▥",
  exams: "▣",
  questions: "▧",
  evaluation: "☑",
  results: "◫",
  analytics: "◴",
  reports: "▨",
  profile: "○",
};
const titles = {
  dashboard: "Overview",
  universities: "Universities",
  academic: "Academic structure",
  students: "Students",
  faculty: "Faculty",
  courses: "Courses & subjects",
  exams: "Examinations",
  questions: "Question bank",
  evaluation: "Evaluation",
  results: "Results",
  analytics: "Performance analytics",
  reports: "Reports",
  profile: "My profile",
};
const descriptions = {
  dashboard: "A clear view of your academic activity, all in one place.",
  students: "Student records, enrollments and account status.",
  faculty: "Your teaching community and subject allocations.",
  courses: "Academic courses, semester subjects and teaching assignments.",
  academic: "Organize departments, academic years and semesters.",
  exams: "Plan, assign and monitor your assessments.",
  questions: "Build a reusable bank of questions for your subjects.",
  evaluation: "Review submitted answers and complete pending evaluations.",
  results: "Review academic outcomes and manage result publication.",
  analytics: "Turn examination results into a clearer picture of progress.",
  reports: "Explore academic reports with the right context.",
  universities: "Manage university accounts across the platform.",
  profile: "Your academic profile and enrollment details.",
};
const role = document.body.dataset.role;
let page = "dashboard",
  search = "",
  saveTimer;
function render() {
  if (!roleViews[page]) page = "dashboard";
  $("#app").innerHTML =
    `<div class="shell"><aside class="sidebar" aria-label="Main navigation"><a class="brand" href="#dashboard"><span class="brand-mark">▥</span><span>University LMS<small>Academic workspace</small></span></a><div class="nav-label">Workspace</div><nav>${roleMenu.map((k) => `<a class="nav-item ${page === k ? "active" : ""}" href="#${k}" ${page === k ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icons[k]}</span>${titles[k]}</a>`).join("")}</nav><div class="sidebar-bottom"><span class="demo-dot"></span>Frontend demo<br/><span style="color:#94b1a7">Sample data · Saved in this browser</span></div></aside><div><header class="topbar"><button class="btn menu-toggle" data-action="menu" aria-label="Toggle navigation">☰</button><div><div class="context-label">${role === "super" ? "Platform workspace" : "Academic year 2026–2027"}</div><div class="context-title">${role === "super" ? "All universities" : "Northbridge University"}</div></div><div class="user-block"><span class="avatar">${esc(
      names[role]
        .split(" ")
        .filter((w) => !w.includes("."))
        .slice(0, 2)
        .map((w) => w[0])
        .join(""),
    )}</span><div class="user-name"><div class="context-title">${names[role]}</div><div class="role-pill">${roles[role]}</div></div>${btn("Switch role", "logout", "", "btn-sm")}</div></header><main id="main" class="content" tabindex="-1">${view()}</main></div></div>`;
}
function view() {
  if (page === "attempt") return roleViews.attempt();
  return `<div class="page-heading"><div><div class="eyebrow">${role === "student" ? "Your learning journey" : role === "super" ? "Platform administration" : "Academic workspace"}</div><h1>${titles[page]}</h1><p class="subtitle">${descriptions[page] || "Manage academic information in your workspace."}</p></div><div class="actions">${pageActions()}</div></div>${roleViews[page]()}`;
}
