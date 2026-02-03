const express = require("express");
const protect = require("../middleware/authMiddleware");
const {dashboardData,getMe} = require("../controllers/userController");
const router = express.Router();
router.get("/dashboardData/:userId",protect, dashboardData);
router.get("/me/:userId",getMe);
module.exports = router;