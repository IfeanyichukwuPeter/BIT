const { readQuestions, writeQuestions } = require("../utils/fileStore");

function getQuestions(req, res) {
  const status = req.query.status;
  let questions = readQuestions();

  if (status) {
    questions = questions.filter((q) => q.status === status);
  }

  res.json(questions);
}

function createQuestion(req, res) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const question = typeof req.body.question === "string" ? req.body.question.trim() : "";

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
}

function updateQuestion(req, res) {
  const id = Number(req.params.id);
  const questions = readQuestions();
  const q = questions.find((item) => item.id === id);

  if (!q) {
    return res.status(404).json({ error: "Question not found." });
  }

  if (typeof req.body.answer === "string") {
    const answer = req.body.answer.trim();
    q.answer = answer;
    if (answer) q.status = "answered";
  }

  writeQuestions(questions);
  res.json(q);
}

function deleteQuestion(req, res) {
  const id = Number(req.params.id);
  const questions = readQuestions();
  const next = questions.filter((q) => q.id !== id);

  if (next.length === questions.length) {
    return res.status(404).json({ error: "Question not found." });
  }

  writeQuestions(next);
  res.status(204).end();
}

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
