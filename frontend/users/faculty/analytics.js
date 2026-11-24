// Faculty: performance measures and analytics screen.
function analytics() {
  const rs = published().filter((r) => subjectAllowed(r.subject)),
    avg = rs.length
      ? (rs.reduce((s, r) => s + pct(r), 0) / rs.length).toFixed(1)
      : "—";
  return `<div class="stats">${stat("Published result records", rs.length, "Filtered to your scope")}${stat("Average percentage", avg === "—" ? "—" : avg + "%", "Unweighted mean of percentages")}${stat("Highest percentage", rs.length ? Math.max(...rs.map(pct)) + "%" : "—", "Published results only")}${stat("Lowest percentage", rs.length ? Math.min(...rs.map(pct)) + "%" : "—", "Published results only")}</div>${panel("Subject performance", `<div class="panel-body">${barChart(rs)}<p class="chart-caption">Mean published percentage by subject. No thresholds for strong or weak subjects have been assumed.</p></div>`)}${panel(
    "Result detail",
    table(
      ["Student", "Subject", "Examination", "Percentage"],
      rs.map((r) => [esc(r.name), esc(r.subject), esc(r.exam), pct(r) + "%"]),
    ),
  )}<div class="notice">Sample-data analytics. Weighting, absence handling, retakes, ranking and trend comparisons require agreed academic policies.</div>`;
}
