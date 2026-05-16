const { readEvents, writeEvents } = require("../utils/fileStore");
const path = require("path");
const fs = require("fs");

function getEvents(req, res) {
  const events = readEvents();
  res.json(events);
}

function createEvent(req, res) {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ 
        error: "Title, startDate, and endDate are required." 
      });
    }

    const events = readEvents();
    
    let imagePath = "/bitimg/default-event.jpg"; // default image
    
    if (req.file) {
      const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `event-${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, req.file.buffer);
      imagePath = `/uploads/${filename}`;
    }

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      description: description ? description.trim() : "",
      startDate,
      endDate,
      image: imagePath
    };

    events.push(newEvent);
    writeEvents(events);

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event." });
  }
}

function updateEvent(req, res) {
  try {
    const id = Number(req.params.id);
    const { title, description, startDate, endDate } = req.body;
    const events = readEvents();
    const event = events.find((e) => e.id === id);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (title) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;

    // Handle image upload
    if (req.file) {
      const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `event-${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, req.file.buffer);
      event.image = `/uploads/${filename}`;
    }

    writeEvents(events);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event." });
  }
}

function deleteEvent(req, res) {
  try {
    const id = Number(req.params.id);
    const events = readEvents();
    const event = events.find((e) => e.id === id);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const updatedEvents = events.filter((e) => e.id !== id);
    writeEvents(updatedEvents);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event." });
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
