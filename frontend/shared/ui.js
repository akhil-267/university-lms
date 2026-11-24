// Reusable HTML, form, chart and table helpers; no user-specific feature logic.
const $ = (s) => document.querySelector(s);
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const id = () => crypto.randomUUID();
const pct = (r) => Math.round((r.marks / r.max) * 1000) / 10;
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").style.display = "block";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => ($("#toast").style.display = "none"), 4200);
}

function badge(s) {
  return `<span class="badge ${["Draft", "Inactive"].includes(s) ? "gray" : ["Pending", "In progress", "Awaiting marking"].includes(s) ? "amber" : ""}">${esc(s)}</span>`;
}

function btn(label, action, value = "", cls = "") {
  return `<button type="button" class="btn ${cls}" data-action="${action}" data-id="${esc(value)}">${label}</button>`;
}

function panel(title, body, action = "") {
  return `<section class="panel"><div class="panel-head"><h2>${title}</h2>${action}</div>${body}</section>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty">No records to display.</td></tr>`}</tbody></table></div>`;
}

function stat(label, value, note) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${esc(value)}</div><div class="stat-note">${note}</div></div>`;
}

function field(label, name, type = "text", value = "", extra = "") {
  return `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra} required></label>`;
}

function select(label, name, values, value = "") {
  return `<label class="field">${label}<select name="${name}">${values.map((v) => `<option value="${esc(v)}" ${v === value ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></label>`;
}

function textarea(label, name, value = "", extra = "") {
  return `<label class="field full">${label}<textarea name="${name}" ${extra}>${esc(value)}</textarea></label>`;
}

function modal(title, content, submit = "Save record", form = "record") {
  const m = $("#modal");
  m.innerHTML = `<div class="dialog-title"><h2 id="modal-title">${title}</h2><button class="close-btn" data-action="close" aria-label="Close dialog">×</button></div><form id="${form}">${content}<p id="form-error" class="error" role="alert"></p><div class="dialog-footer">${btn("Cancel", "close")}<button class="btn btn-primary" type="submit">${submit}</button></div></form>`;
  m.showModal();
}

function barChart(rs) {
  const groups = {};
  rs.forEach((r) => (groups[r.subject] ??= []).push(pct(r)));
  const entries = Object.entries(groups);
  if (!entries.length) return '<p class="empty">No published results yet.</p>';
  return `<div class="chart" role="img" aria-label="${esc(entries.map(([s, vs]) => s + ": " + Math.round(vs.reduce((a, b) => a + b, 0) / vs.length) + " percent").join("; "))}">${entries
    .map(([s, vs]) => {
      const v = Math.round(vs.reduce((a, b) => a + b, 0) / vs.length);
      return `<div class="bar-group"><span class="bar-value">${v}%</span><div class="bar" style="height:${v}%"></div><span class="bar-name">${esc(s.replace("Database Management", "DBMS").replace("Operating Systems", "OS").replace("Computer Networks", "Networks"))}</span></div>`;
    })
    .join("")}</div>`;
}

function error(m) {
  $("#form-error").textContent = m;
}
// Generic table rendering. Each user feature supplies its own data and columns.
function renderRecords(items, headers, values, editable = false) {
  const rows = items.filter(
    (r) =>
      !search ||
      Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const columns = editable ? [...headers, "Actions"] : headers;
  return `<section class="panel"><div class="toolbar"><label><span class="visually-hidden">Search records</span><input class="search" id="search" placeholder="Search records…" value="${esc(search)}"></label><span class="section-note">${rows.length} records · Sample data</span></div>${table(
    columns,
    rows.map((r) => [
      ...values(r),
      ...(editable
        ? [
            btn("Edit", "edit", r.id, "btn-sm") +
              (["students", "faculty", "universities"].includes(page)
                ? " " +
                  btn(
                    r.status === "Active" ? "Deactivate" : "Activate",
                    "status",
                    r.id,
                    "btn-sm",
                  )
                : ""),
          ]
        : []),
    ]),
  )}</section>`;
}
function showRecordForm(collection, recordId, title, buildFields) {
  const r = db[collection].find((r) => r.id === recordId) || {};
  modal(
    (r.id ? "Edit " : "Add ") + title,
    `<input type="hidden" name="collection" value="${collection}"><input type="hidden" name="id" value="${esc(r.id || "")}"><div class="form-grid">${buildFields(r)}</div>`,
  );
}
// Validation is supplied by the role's feature file. Permissions must move to Laravel.
function saveRecord(data, allowedCollections, validate) {
  const c = data.collection;
  if (!allowedCollections.includes(c))
    return error("This record type cannot be changed here.");
  const items = db[c],
    existing = items.find((r) => r.id === data.id);
  Object.keys(data).forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });
  if (
    data.code &&
    items.some(
      (r) =>
        r.id !== data.id && r.code.toLowerCase() === data.code.toLowerCase(),
    )
  )
    return error("This code or ID already exists.");
  if (
    data.email &&
    items.some(
      (r) =>
        r.id !== data.id && r.email.toLowerCase() === data.email.toLowerCase(),
    )
  )
    return error("This email is already registered.");
  if (validate) {
    const message = validate(data);
    if (message) return error(message);
  }
  delete data.collection;
  if (existing) Object.assign(existing, data);
  else items.push({ ...data, id: id() });
  if (!persist()) return;
  $("#modal").close();
  render();
  toast(existing ? "Record updated." : "Record added.");
}
function toggleStatus(collection, recordId) {
  const r = db[collection]?.find((r) => r.id === recordId);
  if (r) {
    r.status = r.status === "Active" ? "Inactive" : "Active";
    if (persist()) {
      render();
      toast("Account status updated in the demo.");
    }
  }
}
function overviewLayout(welcome, cards, main, side) {
  return `<div class="welcome"><div><div class="eyebrow">Your workspace, organized</div><h2>${welcome}</h2><p>Keep your academic activity and progress moving together.</p></div><div class="welcome-art" aria-hidden="true">▥</div></div><div class="stats">${cards}</div><div class="dashboard-grid"><div>${main}</div><div>${side}<div class="notice">Fictional sample data saved in this browser. Laravel integration is pending.</div></div></div>`;
}
