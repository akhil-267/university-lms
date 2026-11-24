const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const frontend = path.join(__dirname, "..", "frontend");
const roles = ["super-admin", "university-admin", "faculty", "student"];
for (const role of roles) {
  test(`${role} loads only shared helpers and its own feature files`, () => {
    const html = fs.readFileSync(path.join(frontend, `${role}.html`), "utf8");
    const scripts = [
      ...html.matchAll(/<script\s+src="([^"]+)"\s+defer><\/script>/g),
    ].map((match) => match[1]);
    assert.ok(scripts.includes(`users/${role}/app.js`));
    assert.equal(scripts.at(-1), "shared/bootstrap.js");
    for (const file of scripts) {
      assert.ok(
        file.startsWith("shared/") || file.startsWith(`users/${role}/`),
        `${role} unexpectedly loads ${file}`,
      );
      assert.ok(
        fs.existsSync(path.join(frontend, file)),
        `Missing script ${file}`,
      );
    }
    // Check the complete classic-script scope for duplicate declarations and invalid syntax.
    new vm.Script(
      scripts
        .map((file) => fs.readFileSync(path.join(frontend, file), "utf8"))
        .join("\n"),
    );
    const styles = [
      ...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g),
    ].map((match) => match[1]);
    for (const file of styles)
      assert.ok(
        fs.existsSync(path.join(frontend, file)),
        `Missing stylesheet ${file}`,
      );
    assert.ok(styles.includes(`users/${role}/styles.css`));
  });
}
test("index links to all four real user HTML pages", () => {
  const html = fs.readFileSync(path.join(frontend, "index.html"), "utf8");
  for (const role of roles) assert.ok(html.includes(`href="${role}.html"`));
});
test("obsolete all-role script is removed", () => {
  assert.equal(fs.existsSync(path.join(frontend, "assets", "app.js")), false);
});
