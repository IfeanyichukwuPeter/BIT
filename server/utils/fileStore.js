const fs = require("fs");
const path = require("path");

const QUESTIONS_FILE = path.join(__dirname, "..", "..", "data", "questions.json");
const EVENTS_FILE = path.join(__dirname, "..", "..", "data", "events.json");

function readQuestions() {
  if (!fs.existsSync(QUESTIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf8"));
}

function writeQuestions(questions) {
  fs.mkdirSync(path.dirname(QUESTIONS_FILE), { recursive: true });
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
}

function readEvents() {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"));
}

function writeEvents(events) {
  fs.mkdirSync(path.dirname(EVENTS_FILE), { recursive: true });
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

module.exports = {
  readQuestions,
  writeQuestions,
  readEvents,
  writeEvents
};
