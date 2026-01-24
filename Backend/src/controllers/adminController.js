const User = require("../models/User");
const Session = require("../models/Session");
const Skill = require("../models/Skill");
const Notification = require("../models/Notification");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {
        role: { $ne: "admin" },
        isTeacher: false
      },
      {
        password: 0,
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
const getDashboardData = async (req, res) => {
  try {
    const sessions = await Session.countDocuments();
    const skills = await Skill.countDocuments();
    let Users = await User.countDocuments({
      isTeacher: false
    });
    const Teachers = await User.countDocuments({
      isTeacher: true
    });
    Users -= 1;
    const data = {
      sessions: sessions,
      skills: skills,
      users: Users,
      teachers: Teachers
    }
    return res.status(200).json({ success: true, data });

  }
  catch (Exception) {
    return res.status(500).json({ message: "500 Server not found." });
  }
}
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // 1️⃣ Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    // 2️⃣ Find & delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    // 3️⃣ If user not found
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user"
    });
  }
};
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ isTeacher: true })
      .select("-password"); // 🔐 never send password

    return res.status(200).json({
      success: true,
      teachers
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teachers"
    });
  }
};
const removeTeacher = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isTeacher) {
      return res.status(400).json({
        success: false,
        message: "User is not a teacher"
      });
    }

    user.isTeacher = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User removed from teacher role successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove teacher"
    });
  }
};
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("skill", "name")
      .populate("teacher", "name email")
      .populate("learner", "name email")
      .sort({ scheduledAt: -1 });

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions"
    });
  }
};
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("skill", "name")
      .populate("teacher", "name email")
      .populate("learner", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch session"
    });
  }
};
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled sessions can be cancelled"
      });
    }

    session.status = "cancelled";
    await session.save();

    // 🔔 Future: refund credits / notify users

    res.status(200).json({
      success: true,
      message: "Session cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel session"
    });
  }
};
const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled sessions can be completed"
      });
    }

    session.status = "completed";
    await session.save();

    res.status(200).json({
      success: true,
      message: "Session marked as completed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete session"
    });
  }
};
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills"
    });
  }
}
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    await Skill.findByIdAndDelete(skillId);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete skill"
    });
  }
}
const addSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required"
      });
    }
    const existingSkill = await Skill.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });
    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists"
      });
    }
    const skill = await Skill.create({
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || ""
    });
    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skill
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add skill"
    });
  }
};
const getNotifications = async(req,res)=>{
   try {
    // Optional: only fetch relevant admin notifications
    const notifications = await Notification.find({
      type: "NEW_TEACHER"
    })
      .sort({ createdAt: -1 }) // latest first
      .limit(20); // safety limit

    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
}
module.exports = {
  getAllUsers,
  getDashboardData,
  deleteUser,
  getTeachers,
  removeTeacher,
  completeSession,
  cancelSession,
  getAllSessions,
  getSessionById, getSkills, deleteSkill, addSkill,getNotifications
};