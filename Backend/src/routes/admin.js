const express = require("express");
const { getAllUsers, getDashboardData } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin → Get all users
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/dashboardData",protect,isAdmin,getDashboardData);
module.exports = router;