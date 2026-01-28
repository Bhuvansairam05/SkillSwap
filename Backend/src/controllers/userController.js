const User = require("../models/User");
const Session = require("../models/Session");

const dashboardData = async (req, res) => {
  try {
    console.log("entered");
    const userId = req.params.userId; // coming from JWT middleware

    // 1️⃣ Get user basic info
    const user = await User.findById(userId).select(
      "credits rating"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2️⃣ Get completed sessions for learner
    const completedSessions = await Session.find({
      learner: userId,
      status: "completed"
    }).select("duration");

    // 3️⃣ Calculate total hours (minutes → hours)
    const totalMinutes = completedSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    // 4️⃣ Send dashboard response
    res.status(200).json({
      success: true,
      data: {
        credits: user.credits,
        completedSessions: completedSessions.length,
        totalHours,
        rating: user.rating || 0
      }
    });

  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
};

module.exports = { dashboardData };
