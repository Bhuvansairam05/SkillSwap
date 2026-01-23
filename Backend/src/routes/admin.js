const express = require("express");
const { getAllUsers, getDashboardData, deleteUser,getTeachers,removeTeacher } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin → Get all users
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/dashboardData",protect,isAdmin,getDashboardData);
router.delete("/deleteUser/:userId",protect,isAdmin,deleteUser);
router.get("/teachers",protect,isAdmin,getTeachers);
router.put("/removeTeacher/:userId",protect,isAdmin,removeTeacher);
module.exports = router;