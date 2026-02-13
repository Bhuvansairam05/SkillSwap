const express = require("express");
const router = express.Router();
const {
  signup,
  login,googleLogin
} = require("../controllers/authController");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);
router.post("/google-login", googleLogin);

module.exports = router;
