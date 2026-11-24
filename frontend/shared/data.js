// Fictional fixture data and browser persistence shared across user pages. Not an authentication boundary.
const KEY = "university-lms-demo-v1";
const seed = () => ({
  universities: [
    { id: "u1", name: "Northbridge University", code: "NBU", status: "Active" },
    { id: "u2", name: "Westlake University", code: "WLU", status: "Active" },
  ],
  academic: [
    { id: "d1", type: "Department", name: "Computer Science", code: "CSE" },
    { id: "y1", type: "Academic year", name: "2026–2027", code: "AY26" },
    { id: "s1", type: "Semester", name: "Semester 5", code: "SEM5" },
  ],
  students: [
    {
      id: "s1",
      name: "Aarav Sharma",
      email: "aarav@example.test",
      code: "NBU26001",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      status: "Active",
    },
    {
      id: "s2",
      name: "Diya Patel",
      email: "diya@example.test",
      code: "NBU26002",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      status: "Active",
    },
    {
      id: "s3",
      name: "Ishaan Reddy",
      email: "ishaan@example.test",
      code: "NBU26003",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      status: "Active",
    },
    {
      id: "s4",
      name: "Sara Khan",
      email: "sara@example.test",
      code: "NBU26004",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      status: "Inactive",
    },
  ],
  faculty: [
    {
      id: "f1",
      name: "Dr. Meera Nair",
      email: "meera@example.test",
      code: "FAC101",
      department: "Computer Science",
      subject: "Database Management",
      status: "Active",
    },
    {
      id: "f2",
      name: "Dr. Arjun Menon",
      email: "arjun@example.test",
      code: "FAC102",
      department: "Computer Science",
      subject: "Computer Networks",
      status: "Active",
    },
  ],
  courses: [
    {
      id: "c1",
      name: "B.Tech Computer Science",
      code: "CSE301",
      subject: "Database Management",
      semester: "Semester 5",
      faculty: "Dr. Meera Nair",
    },
    {
      id: "c2",
      name: "B.Tech Computer Science",
      code: "CSE302",
      subject: "Computer Networks",
      semester: "Semester 5",
      faculty: "Dr. Arjun Menon",
    },
    {
      id: "c3",
      name: "B.Tech Computer Science",
      code: "CSE303",
      subject: "Operating Systems",
      semester: "Semester 5",
      faculty: "Dr. Meera Nair",
    },
  ],
  questions: [
    {
      id: "q1",
      subject: "Database Management",
      type: "MCQ",
      text: "Which SQL clause filters grouped results?",
      options: ["WHERE", "HAVING", "ORDER BY", "SELECT"],
      correct: "HAVING",
      marks: 5,
      topic: "SQL",
      difficulty: "Medium",
    },
    {
      id: "q2",
      subject: "Database Management",
      type: "True/False",
      text: "A primary key uniquely identifies each row in a table.",
      options: ["True", "False"],
      correct: "True",
      marks: 5,
      topic: "Keys",
      difficulty: "Easy",
    },
    {
      id: "q3",
      subject: "Database Management",
      type: "Short answer",
      text: "What does SQL stand for?",
      options: [],
      correct: "",
      marks: 5,
      topic: "SQL",
      difficulty: "Easy",
    },
    {
      id: "q4",
      subject: "Database Management",
      type: "Descriptive",
      text: "Explain normalization and describe the purpose of the first three normal forms.",
      options: [],
      correct: "",
      marks: 10,
      topic: "Normalization",
      difficulty: "Medium",
    },
  ],
  exams: [
    {
      id: "e1",
      title: "Database Management · Unit Assessment",
      subject: "Database Management",
      duration: 30,
      passing: 10,
      start: new Date(Date.now() - 86400000).toISOString(),
      end: new Date(Date.now() + 7 * 86400000).toISOString(),
      instructions:
        "Read every question carefully. Answers are saved in this browser as you work. Review your answers before submitting.",
      questionIds: ["q1", "q2", "q3", "q4"],
      assigned: ["s1", "s2", "s3"],
      status: "Scheduled",
    },
    {
      id: "e2",
      title: "Operating Systems · Practice Quiz",
      subject: "Operating Systems",
      duration: 20,
      passing: 5,
      start: new Date(Date.now() + 86400000).toISOString(),
      end: new Date(Date.now() + 2 * 86400000).toISOString(),
      instructions: "An upcoming sample examination.",
      questionIds: [],
      assigned: ["s1", "s2"],
      status: "Draft",
    },
  ],
  attempts: [],
  results: [
    {
      id: "r1",
      student: "s1",
      name: "Aarav Sharma",
      exam: "SQL Fundamentals",
      subject: "Database Management",
      marks: 36,
      max: 40,
      status: "Published",
      date: "2026-11-10",
    },
    {
      id: "r2",
      student: "s1",
      name: "Aarav Sharma",
      exam: "Process Management",
      subject: "Operating Systems",
      marks: 32,
      max: 40,
      status: "Published",
      date: "2026-11-15",
    },
    {
      id: "r3",
      student: "s2",
      name: "Diya Patel",
      exam: "SQL Fundamentals",
      subject: "Database Management",
      marks: 30,
      max: 40,
      status: "Published",
      date: "2026-11-10",
    },
    {
      id: "r4",
      student: "s3",
      name: "Ishaan Reddy",
      exam: "SQL Fundamentals",
      subject: "Database Management",
      marks: 26,
      max: 40,
      status: "Published",
      date: "2026-11-10",
    },
  ],
});
let db;
try {
  db = JSON.parse(localStorage.getItem(KEY)) || seed();
  if (!Array.isArray(db.exams)) throw Error();
} catch {
  db = seed();
}
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
    return true;
  } catch {
    toast(
      "Storage is full or unavailable. Your latest change could not be saved.",
    );
    return false;
  }
}
