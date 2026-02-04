const express = require("express");
const protect = require("../middleware/authMiddleware");
const {dashboardData,getMe, getUserSkills,
  getAllSkills,
  addLearningSkill,
  deleteLearningSkill,
  addTeachingSkill,
  deleteTeachingSkill,
  updateLearningProgress,getBookableSkills,getTeachersBySkill} = require("../controllers/userController");
const {
  getUserSessions,completeSession,cancelSession,createSession, getTeacherSessions,
  approveSessionByTeacher,
} = require("../controllers/sessionController");
const router = express.Router();
router.get("/dashboardData/:userId",protect, dashboardData);
router.get("/me/:userId",getMe);
router.get("/skills/:userId", getUserSkills);
router.get("/all-skills", getAllSkills);

router.post("/skills/learning/:userId", addLearningSkill);
router.delete("/skills/learning/:userId/:skillId", deleteLearningSkill);

router.post("/skills/teaching/:userId", addTeachingSkill);
router.delete("/skills/teaching/:userId/:skillId", deleteTeachingSkill);

router.put("/skills/progress/:userId", updateLearningProgress);


router.get("/sessions/:userId", getUserSessions);
router.put("/sessions/complete/:sessionId", completeSession);
router.put("/sessions/cancel/:sessionId", cancelSession);

router.post("/sessions", createSession);

router.get("/teacher/sessions/:teacherId", getTeacherSessions);
router.put("/teacher/sessions/approve/:sessionId", approveSessionByTeacher);
router.get("/booking/skills", getBookableSkills);
router.get("/booking/teachers/:skillId", getTeachersBySkill);

module.exports = router;