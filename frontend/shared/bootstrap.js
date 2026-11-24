// Common event wiring. Only the selected user’s feature files are loaded.

// This file only dispatches UI events. Feature handlers live in the loaded user folder.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action,
    value = button.dataset.id;
  if (action === "close") return $("#modal").close();
  if (action === "logout") return location.assign("index.html");
  if (action === "menu") return $(".shell").classList.toggle("nav-open");
  if (action === "print") return window.print();
  if (action === "csv") return exportCSV();
  roleActions[action]?.(value);
});
document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target,
    fd = new FormData(form),
    data = Object.fromEntries(fd);
  if (form.getAttribute("id") === "dismiss") return $("#modal").close();
  roleForms[form.getAttribute("id")]?.(data, fd);
});
document.addEventListener("input", (event) => {
  if (event.target.id === "search") {
    search = event.target.value;
    const start = event.target.selectionStart;
    render();
    $("#search")?.focus();
    $("#search")?.setSelectionRange(start, start);
  }
  roleHooks.input?.(event);
});
document.addEventListener("change", (event) => roleHooks.change?.(event));
window.addEventListener("hashchange", () => {
  const next = location.hash.slice(1);
  search = "";
  page = roleViews[next] ? next : "dashboard";
  render();
});
page = roleViews[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";
render();
if (roleHooks.tick) setInterval(roleHooks.tick, 1000);
