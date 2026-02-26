const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");

const app = express();

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/questions", questionRoutes);

module.exports = app;