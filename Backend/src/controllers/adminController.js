const User = require("../models/User");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $ne: "admin" } }, // exclude admins
      {
        password: 0,          // exclude sensitive fields
        skillsLearning: 0,
        skillsTeaching: 0
      }
    ).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

module.exports = {
  getAllUsers
};