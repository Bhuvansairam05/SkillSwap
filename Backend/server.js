const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const adminRoutes = require("./src/routes/admin");
app.use("/api/admin", adminRoutes);
// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect(process.env.mongodb_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// --------------------
// Routes
// --------------------
app.get("/", (req, res) => {
  res.send("SkillSwap Backend is running 🚀");
});

// Auth routes (we’ll create this next)

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});