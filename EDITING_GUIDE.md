# Where to edit each user's functionality

Open `frontend/index.html` through your local server to choose a user. Each HTML entry loads the shared helpers and only its own user folder. Student pages never load faculty/admin feature scripts, and vice versa. This is code organization for editing; Laravel must still provide real authentication and authorization.

## Main folders

```text
frontend/
  index.html                       User selection page
  super-admin.html                 Loads Super Admin files only
  university-admin.html            Loads University Admin files only
  faculty.html                     Loads Faculty files only
  student.html                     Loads Student files only
  shared/
    data.js                        Sample records and browser storage
    ui.js                          Reusable tables, forms and charts
    layout.js                      Sidebar, header and page shell
    bootstrap.js                   Common event dispatch and startup
    styles.css                     Shared appearance and mobile layout
  users/
    super-admin/                   Platform administration functionality
    university-admin/              University administration functionality
    faculty/                       Teaching and marking functionality
    student/                       Student functionality
  assets/vendor/                   Bootstrap CSS and its license
```

## Super Admin

Edit `frontend/users/super-admin/`:

- `app.js`: menu, screen registration, actions and form handlers.
- `dashboard.js`: overview cards and platform panels.
- `universities.js`: university table, university form and displayed fields.
- `reports.js`: platform reports and CSV download.
- `styles.css`: styling changes for this role only.

## University Admin

Edit `frontend/users/university-admin/`:

- `app.js`: menu, screen registration, editable record types and actions.
- `academic.js`: departments, years and semesters.
- `students.js`: student list and registration/edit fields.
- `faculty.js`: faculty list and registration/edit fields.
- `courses.js`: course/subject list and academic allocation fields.
- `exams.js`: exam monitoring and details (no student attempt handlers).
- `dashboard.js`, `analytics.js`, `reports.js`: this role's corresponding screens.
- `styles.css`: this role's style overrides.

## Faculty

Edit `frontend/users/faculty/`:

- `app.js`: menu, academic scope and action/form registration.
- `questions.js`: question table, creation/edit form and question validation.
- `exams.js`: examination creation form, validation, assignment and details.
- `evaluation.js`: submitted answers, manual marks, feedback and approval.
- `results.js`: result display, publication confirmation and publication handler.
- `courses.js`, `students.js`: assigned academic information.
- `dashboard.js`, `analytics.js`, `reports.js`: this role's corresponding screens.
- `styles.css`: this role's style overrides.

## Student

Edit `frontend/users/student/`:

- `app.js`: menu, own-record scope, button actions and timer wiring.
- `exams.js`: assigned exam list and instructions.
- `attempt.js`: start/resume, question screen, answer saving, timer and submission.
- `results.js`: display of the student's published results only.
- `profile.js`: displayed student profile fields.
- `courses.js`: course and subject display.
- `dashboard.js`, `analytics.js`, `reports.js`: this role's corresponding screens.
- `styles.css`: this role's style overrides.

## Common editing examples

To change student answer saving or submission, edit `users/student/attempt.js`. To change the faculty examination form, edit `users/faculty/exams.js`. To add a student registration field, edit `users/university-admin/students.js`; update the corresponding table columns if it should be displayed. To change only faculty reports, edit `users/faculty/reports.js`—the other role reports are independent.

For changes to a form's stored data, also consider affected sample records in `shared/data.js` and any screens that consume the field. Existing browser storage takes precedence over new fixture defaults, so clear the demo key to see new fixture data.

## Adding a feature to one user

1. Add a feature file in that user's folder with a uniquely named view function, such as `attendanceView()`.
2. Add a deferred script tag to that role's root HTML page, before its `app.js` tag.
3. Register the view in that role's `roleViews` object in `app.js`, and add the route to `roleMenu` if it needs a navigation item.
4. Add the title/icon/description to `shared/layout.js` as required; these are presentation labels, not permissions.
5. Register buttons in that role's `roleActions` and forms in `roleForms`. Keep business handlers in the new feature file.
6. Verify the page and any workflows that depend on it.

Scripts are plain deferred JavaScript, loaded in document order. They share helper names within one page; do not load two users' script folders into the same page. They require no build step or jQuery. Changes to shared helpers affect all user pages; changes to a user feature file affect only pages that load that folder.

## Run and check

```sh
python3 -m http.server 8080 --directory frontend
```

Open http://localhost:8080/index.html. After editing, refresh the browser. If the old layout is cached, use a hard refresh. Run the file-isolation checks with:

```sh
node --test tests/role-isolation.test.cjs
```

The superseded `assets/app.js` and `assets/styles.css` were removed. All current sources are in `shared/` and `users/`; modify those files rather than older ZIP copies.
