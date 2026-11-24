// Faculty: report filters, columns and CSV export.
let reportType = "Student performance",
  reportSubject = "All subjects";
function reportRows() {
  let rows = published().filter((r) => subjectAllowed(r.subject));
  if (reportSubject !== "All subjects")
    rows = rows.filter((r) => r.subject === reportSubject);
  return rows;
}
function reports() {
  const rs = reportRows();
  return `<section class="panel"><div class="panel-head"><h2>Report builder</h2><span class="section-note">Published results only</span></div><div class="panel-body form-grid">${select("Report type", "reportType", ["Student performance", "Examination", "Course-wise", "Department-wise", "Semester-wise", "Faculty", "Result", "Pass/fail"], reportType)}${select("Subject filter", "reportSubject", ["All subjects", ...new Set(visibleCourses().map((c) => c.subject))], reportSubject)}</div></section>${panel(
    reportType + " report",
    table(
      ["Student", "Examination", "Subject", "Marks", "Percentage"],
      rs.map((r) => [
        esc(r.name),
        esc(r.exam),
        esc(r.subject),
        r.marks + "/" + r.max,
        pct(r) + "%",
      ]),
    ),
  )}<div class="notice">${reportType === "Pass/fail" ? "Pass/fail classifications need an agreed threshold per examination; this preview shows marks without inventing outcomes." : ["Course-wise", "Department-wise", "Semester-wise", "Faculty"].includes(reportType) ? "The demo cohort is Computer Science, B.Tech, Semester 5. Multi-group report breakdowns will use Laravel academic relationships." : "Preview uses sample published records scoped to this workspace."} CSV is a data export, not a native Excel workbook. Print supports browser Save as PDF.</div>`;
}
function exportCSV() {
  const lines = [
    ["Student", "Examination", "Subject", "Marks", "Maximum", "Percentage"],
    ...reportRows().map((r) => [
      r.name,
      r.exam,
      r.subject,
      r.marks,
      r.max,
      pct(r),
    ]),
  ];
  const safe = (v) =>
    '"' +
    String(/^[=+@\-\t\r]/.test(String(v)) ? "'" + v : v).replace(/"/g, '""') +
    '"';
  const blob = new Blob(
      ["\uFEFF" + lines.map((row) => row.map(safe).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    ),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "lms-report.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Report exported as CSV.");
}
