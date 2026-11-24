# Frontend validation

Checked 24 November 2026 using the local app in Chrome:

- JavaScript syntax check passed.
- Administrator workspace, student list and duplicate roll-number validation checked.
- Student: started Database Management exam, answered all four types, reloaded, verified saved answers and continuing deadline.
- Manual submit confirmation and submitted state checked.
- Faculty: correct objective answers scored 10/10; manually awarded 5 and 8 marks; approved and published 23/25.
- Student: confirmed released result is 23/25 (92%) and only own published records are shown.
- Responsive layout checked at 390px; fixed table/grid overflow and mobile navigation.

No Laravel server, real authentication, server timeout job, multi-tenant security or production load testing is included. Automatic browser-timeout logic is present but a full timed-out scenario has not been independently exercised. These are frontend checks, not backend acceptance.
