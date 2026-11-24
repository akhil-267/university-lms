// Student profile details and displayed fields.
function profile() {
  const s = db.students.find((s) => s.id === "s1");
  return panel(
    "Student profile",
    `<div class="panel-body"><div class="user-block" style="margin-bottom:25px"><span class="avatar">AS</span><div><h2>${esc(s.name)}</h2><p class="subtitle">${esc(s.code)}</p></div></div><dl class="profile-details">${Object.entries(
      {
        Email: s.email,
        Department: s.department,
        Course: s.course,
        Semester: "Semester 5",
        "Academic year": "2026–2027",
        Status: s.status,
      },
    )
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
      .join(
        "",
      )}</dl><div class="notice">Profile changes are managed by your university administrator.</div></div>`,
  );
}
