const express = require("express");
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", getQuestions);
router.post("/", createQuestion);
router.patch("/:id", authMiddleware, updateQuestion);
router.delete("/:id", authMiddleware, deleteQuestion);

module.exports = router;
