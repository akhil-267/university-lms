// Super Admin platform report and export. No student-level data.
function reports() {
  return (
    panel(
      "Platform report",
      table(
        ["University", "Code", "Status"],
        db.universities.map((u) => [esc(u.name), esc(u.code), badge(u.status)]),
      ),
    ) +
    '<div class="notice">Platform oversight does not grant academic marking rights.</div>'
  );
}
function exportCSV() {
  const rows = [
    ["University", "Code", "Status"],
    ...db.universities.map((u) => [u.name, u.code, u.status]),
  ];
  downloadCSV(rows);
}
function downloadCSV(rows) {
  const safe = (value) =>
    '"' +
    String(/^[=+@\-\t\r]/.test(String(value)) ? "'" + value : value).replace(
      /"/g,
      '""',
    ) +
    '"';
  const blob = new Blob(
    ["\uFEFF" + rows.map((r) => r.map(safe).join(",")).join("\r\n")],
    { type: "text/csv;charset=utf-8;" },
  );
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "university-report.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
