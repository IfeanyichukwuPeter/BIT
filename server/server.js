const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "..", "data", "questions.json");

app.use(express.json());

// Serve the existing static site from the project root.
app.use(express.static(path.join(__dirname, "..")));

function readQuestions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeQuestions(questions) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
}

app.get("/api/questions", (req, res) => {
  const status = req.query.status;
  let questions = readQuestions();

  if (status) {
    questions = questions.filter((q) => q.status === status);
  }

  res.json(questions);
});

app.post("/api/questions", (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const question =
    typeof req.body.question === "string" ? req.body.question.trim() : "";

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const questions = readQuestions();
  const newQuestion = {
    id: Date.now(),
    name: name || "Anonymous",
    question,
    answer: "",
    status: "pending"
  };

  questions.push(newQuestion);
  writeQuestions(questions);

  res.status(201).json(newQuestion);
});

app.patch("/api/questions/:id", (req, res) => {
  const id = Number(req.params.id);
  const questions = readQuestions();
  const q = questions.find((item) => item.id === id);

  if (!q) {
    return res.status(404).json({ error: "Not found." });
  }

  if (typeof req.body.answer === "string") {
    const answer = req.body.answer.trim();
    q.answer = answer;
    if (answer) q.status = "answered";
  }

  writeQuestions(questions);
  res.json(q);
});

app.delete("/api/questions/:id", (req, res) => {
  const id = Number(req.params.id);
  const questions = readQuestions();
  const next = questions.filter((q) => q.id !== id);

  if (next.length === questions.length) {
    return res.status(404).json({ error: "Not found." });
  }

  writeQuestions(next);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
