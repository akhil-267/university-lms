// Faculty only: question bank columns, question form and validation.
function questionsView() {
  return renderRecords(
    db.questions.filter((q) => subjectAllowed(q.subject)),
    ["Question", "Type", "Subject", "Marks", "Difficulty"],
    (r) => [
      esc(r.text),
      esc(r.type),
      esc(r.subject),
      r.marks,
      esc(r.difficulty),
    ],
    true,
  );
}
function questionForm(recordId) {
  showRecordForm(
    "questions",
    recordId,
    "question",
    (r) =>
      select(
        "Subject",
        "subject",
        visibleCourses().map((c) => c.subject),
        r.subject,
      ) +
      select(
        "Question type",
        "type",
        ["MCQ", "True/False", "Short answer", "Descriptive"],
        r.type,
      ) +
      textarea("Question", "text", r.text || "", "required") +
      field("Marks", "marks", "number", r.marks || 5, 'min="1" max="100"') +
      field("Topic", "topic", "text", r.topic || "") +
      select(
        "Difficulty",
        "difficulty",
        ["Easy", "Medium", "Hard"],
        r.difficulty || "Medium",
      ) +
      textarea(
        "MCQ options (one per line)",
        "options",
        (r.options || []).join("\n"),
      ) +
      field(
        "Correct answer (exact MCQ option or True / False)",
        "correct",
        "text",
        r.correct || "",
      ),
  );
  $('#modal [name="correct"]').removeAttribute("required");
}
function validateQuestion(data) {
  data.marks = Number(data.marks);
  data.options =
    data.type === "MCQ"
      ? data.options
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : data.type === "True/False"
        ? ["True", "False"]
        : [];
  if (!Number.isFinite(data.marks) || data.marks <= 0)
    return "Enter valid positive marks.";
  if (
    data.type === "MCQ" &&
    (data.options.length < 2 ||
      new Set(data.options).size !== data.options.length ||
      !data.options.includes(data.correct))
  )
    return "Provide at least two unique options and an exact matching correct answer.";
  if (data.type === "True/False" && !data.options.includes(data.correct))
    return "Correct answer must be True or False.";
  if (!["MCQ", "True/False"].includes(data.type)) data.correct = "";
}
