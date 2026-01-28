const express = require("express");
const protect = require("../middleware/authMiddleware");
const {dashboardData} = require("../controllers/userController");
const router = express.Router();
router.get("/dashboardData/:userId",protect, dashboardData);
module.exports = router;