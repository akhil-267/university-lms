// Super Admin dashboard only. Academic marking and student answers are not displayed here.

function dashboard() {
  const cards =
    stat("Universities", db.universities.length, "Registered on the platform") +
    stat("Students", db.students.length, "Northbridge sample records") +
    stat("Faculty", db.faculty.length, "Northbridge sample records") +
    stat(
      "Sample accounts",
      db.students.length + db.faculty.length + 3,
      "Includes platform and university admins",
    );
  return overviewLayout(
    "A connected university platform.",
    cards,
    panel(
      "University registry",
      table(
        ["University", "Code", "Status"],
        db.universities.map((u) => [esc(u.name), esc(u.code), badge(u.status)]),
      ),
    ),
    panel(
      "Platform workspace",
      '<div class="panel-body"><p>Manage university accounts and review platform-level reports.</p><a href="#universities" class="btn btn-primary">Manage universities</a></div>',
    ),
  );
}
