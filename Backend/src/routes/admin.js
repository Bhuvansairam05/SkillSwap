const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin → Get all users
router.get("/users", protect, isAdmin, getAllUsers);

module.exports = router;