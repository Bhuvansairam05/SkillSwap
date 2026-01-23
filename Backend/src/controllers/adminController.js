const User = require("../models/User");
const Session = require("../models/Session");
const Skill = require("../models/Skill");
// GET /api/admin/users
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
const getDashboardData = async(req,res)=>{
  try{
    const sessions = await Session.countDocuments();
    const skills = await Skill.countDocuments();
    const Users = await User.countDocuments({
      isTeacher:false
    });
    const Teachers = await User.countDocuments({
      isTeacher:true
    });
    const data = {
      sessions:sessions,
      skills:skills,
      users:Users,
      teachers:Teachers
    }
    return res.status(200).json({success:true,data});

  }
  catch(Exception){
    return res.status(500).json({message:"500 Server not found."});
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

module.exports = {
  getAllUsers,
  getDashboardData,
  deleteUser,
  getTeachers,
  removeTeacher
};