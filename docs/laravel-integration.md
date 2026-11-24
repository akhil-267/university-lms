# Laravel integration handoff

## Frontend organization

`frontend/index.html` contains the page entry and accessibility landmarks. `assets/styles.css` contains the responsive layout and print rules. `assets/app.js` holds the fixture store, role views, forms and interaction handlers. For a production application, split these into feature modules or Blade views and remove fixture answer keys from all student bundles/responses.

## Replace demo persistence

- Replace persona login with Laravel session authentication, logout and password recovery. Regenerate sessions on login and protect state-changing requests with CSRF.
- Replace localStorage reads/writes with validated Laravel endpoints; do not upload local fixture storage as real data.
- Render shared layouts/components with Blade or keep same-origin JSON interactions for exam controls.
- Never trust route visibility, client role, university ID, scores, status or browser time.

## Suggested endpoint contracts

- `/login`, `/logout`, `/forgot-password`, `/reset-password`: session and recovery flows.
- `/api/v1/universities`, `/students`, `/faculty`, `/courses`, `/subjects`: scoped resource operations.
- `/api/v1/questions`, `/exams`, `/exams/{id}/assignments`: exam authoring and assignment.
- `POST /api/v1/exams/{id}/attempts`: start/resume with server_now and deadline_at.
- `GET /api/v1/attempts/{id}`: sanitized delivery snapshot and saved answers; no keys.
- `PUT /api/v1/attempts/{id}/answers/{questionId}`: response plus expected revision; return accepted revision, saved_at, state and deadline.
- `POST /api/v1/attempts/{id}/submit`: one atomic finalization; retries return same final state.
- Evaluation, approval and publication endpoints: faculty permissions, mark bounds, revision history.
- Results, analytics, reports and private export downloads: same role/university/record scope.

Session-enable same-origin JSON routes explicitly. Default API middleware is not a security plan. Use 401/403, 422 validation and 409 lifecycle/revision conflicts consistently. Use server-controlled timeout workers with scheduler recovery scans even when no browser is open. Add CSP, escaped output, parameterized queries, rate limits, private file access and secure cookies/HTTPS.

## Decisions to confirm

Retakes, late entry, deadline formula, accommodations, university suspension during attempts, short-answer/negative/partial marking, rounding, admin academic powers, publication corrections, class/group assignment, analytics denominators and export scope. No business owner role is assumed: review with the project team, university administrators and faculty.

## Checks before production

Cross-university and four-role access tests; concurrent saves and stale revisions; timeout after browser close; repeated submission; immutable question snapshots; complete marking before publication; grading/report reconciliation; restore and peak-load tests. The frontend demo is not evidence these backend checks have passed.
