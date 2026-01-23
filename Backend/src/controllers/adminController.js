const User = require("../models/User");
const Session = require("../models/Session");
const Skill = require("../models/Skill");
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
module.exports = {
  getAllUsers,
  getDashboardData
};