const express = require("express");
const { getAllUsers, getDashboardData, deleteUser,getTeachers,removeTeacher, getAllSessions,
  getSessionById,
  cancelSession,
  completeSession,
  getSkills,
  deleteSkill,
  addSkill} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/dashboardData",protect,isAdmin,getDashboardData);
router.delete("/deleteUser/:userId",protect,isAdmin,deleteUser);
router.get("/teachers",protect,isAdmin,getTeachers);
router.patch("/removeTeacher/:userId",protect,isAdmin,removeTeacher);
router.get("/sessions", protect, isAdmin, getAllSessions);
router.get("/sessions/:id", protect, isAdmin, getSessionById);
router.patch("/sessions/:id/cancel", protect, isAdmin, cancelSession);
router.patch("/sessions/:id/complete", protect, isAdmin, completeSession);
router.get("/getSkills",protect,isAdmin,getSkills);
router.delete("/deleteSkill/:skillId",protect,isAdmin,deleteSkill);
router.post("/addSkill",protect,isAdmin,addSkill);
module.exports = router;