const express = require("express");
const { getAllUsers, getDashboardData, deleteUser,getTeachers,removeTeacher, getAllSessions,
  getSessionById,
  cancelSession,
  completeSession} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin → Get all users
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/dashboardData",protect,isAdmin,getDashboardData);
router.delete("/deleteUser/:userId",protect,isAdmin,deleteUser);
router.get("/teachers",protect,isAdmin,getTeachers);
router.patch("/removeTeacher/:userId",protect,isAdmin,removeTeacher);
router.get("/sessions", protect, isAdmin, getAllSessions);
router.get("/sessions/:id", protect, isAdmin, getSessionById);
router.patch("/sessions/:id/cancel", protect, isAdmin, cancelSession);
router.patch("/sessions/:id/complete", protect, isAdmin, completeSession);
module.exports = router;