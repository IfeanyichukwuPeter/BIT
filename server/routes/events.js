const express = require("express");
const multer = require("multer");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads (store in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get("/", getEvents);
router.post("/", upload.single("image"), createEvent);
router.patch("/:id", authMiddleware, upload.single("image"), updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;
