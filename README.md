# University LMS — frontend

HTML, CSS, Bootstrap 5.3.3 and vanilla JavaScript frontend for the University LMS. No framework build step required. PHP Laravel and MySQL integration is the next stage.

## Run

From this repository:

```sh
python3 -m http.server 8080 --directory frontend
```

Open http://localhost:8080. Choose Super Admin, University Admin, Faculty or Student. These are demo personas, not authenticated accounts. Bootstrap CSS is bundled locally with its license header for offline use. No Bootstrap JavaScript is needed.

## Included

- Four responsive role workspaces and mobile navigation.
- University, department/year/semester, student, faculty and subject management forms.
- Validation, searchable tables and account status controls.
- Question bank: MCQ, True/False, short answer and descriptive.
- Faculty exam creation with question selection and student assignment.
- Student instructions, start/resume, navigation, answer saving, timer and confirmation.
- Objective scoring, manual evaluation, approval and result publication.
- Published-result charts, reports, subject filtering, CSV download and browser print/PDF.
- Example records are fictional. `example.test` email addresses cannot receive mail.

## End-to-end demo

1. Open Student and start the Database Management assessment.
2. Save answers, navigate questions and submit.
3. Switch to Faculty; open Evaluation, mark short/descriptive answers and approve.
4. Open Results and publish the approved result.
5. Switch to Student and review the published result and analytics.

Changes persist only in the current browser's localStorage under `university-lms-demo-v1`. Persona selection is in sessionStorage. Clear the demo storage key through browser developer tools to reset. Do not use real student data.

## Boundaries

This is a frontend demonstration, not a secure deployable LMS. Role switching and local filters are for UX review; they provide no security. All roles share the demo database. Only Northbridge has sample academic records; Westlake is a platform registry example. Faculty scope is simplified to assigned subjects, and the demo student is Aarav Sharma. The demo uses one attempt per examination, manual short-answer marking and a hard-close browser deadline; these are illustrative policies, not agreed university rules. Keys exist in frontend fixture data and must never be shipped this way in production.

The backend must enforce authentication, university isolation, assignment/ownership, server timing, transactional/idempotent submission, secure grading, audit logging and result publication. Browser timeout only runs while the page is open; it catches expired attempts when reopened but is not an autonomous server submission system. CSV is not a native Excel workbook. Multi-group analytics, assignment groups, import, live notifications, email recovery and correction workflows await backend/policy work. Reports currently use the single sample cohort; grouped report choices explain this limitation in the UI.

See [Laravel integration notes](docs/laravel-integration.md) for the handoff.
