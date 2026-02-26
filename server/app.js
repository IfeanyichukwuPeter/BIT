const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");

const app = express();

app.use(express.json());

// Serve the existing static site from the project root.
app.use(express.static(path.join(__dirname, "..")));

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/questions", questionRoutes);

module.exports = app;