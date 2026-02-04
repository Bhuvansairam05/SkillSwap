const User = require("../models/User");
const Session = require("../models/Session");
const Skill = require("../models/Skill");
const Notification = require("../models/Notification");
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
const getMe = async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  res.json({ user });
};
const getUserSkills = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("skillsLearning.skill")
      .populate("skillsTeaching.skill")
      .select("skillsLearning skillsTeaching");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().select("name category");
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addLearningSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    const exists = user.skillsLearning.find(
      s => s.skill.toString() === skillId
    );

    if (exists)
      return res.status(400).json({ message: "Skill already added" });

    user.skillsLearning.push({ skill: skillId, progress: 0 });
    await user.save();

    res.json({ message: "Learning skill added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteLearningSkill = async (req, res) => {
  try {
    const { skillId, userId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { skillsLearning: { skill: skillId } }
    });

    res.json({ message: "Learning skill removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addTeachingSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    const skill = await Skill.findById(skillId);

    const exists = user.skillsTeaching.find(
      s => s.skill.toString() === skillId
    );

    if (exists)
      return res.status(400).json({ message: "Skill already added" });

    // 1️⃣ Add skill to user
    user.skillsTeaching.push({ skill: skillId, approved: false });
    await user.save();

    // 2️⃣ 🔥 Notify admin
    await Notification.create({
      type: "NEW_TEACHER",
      message: `${user.name} requested to teach ${skill.name}`,
      skills: [skillId],
      refId: userId
    });

    res.json({ message: "Teaching skill sent for admin approval" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteTeachingSkill = async (req, res) => {
  try {
    const { skillId, userId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { skillsTeaching: { skill: skillId } }
    });

    res.json({ message: "Teaching skill removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateLearningProgress = async (req, res) => {
  try {
    const { skillId, progress } = req.body;
    const userId = req.params.userId;

    await User.updateOne(
      { _id: userId, "skillsLearning.skill": skillId },
      { $set: { "skillsLearning.$.progress": progress } }
    );

    res.json({ message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Skills which have at least 1 approved teacher
const getBookableSkills = async (req, res) => {
  try {
    const users = await User.find({
      "skillsTeaching.approved": true
    }).populate("skillsTeaching.skill", "name");

    const skillMap = new Map();

    users.forEach(user => {
      user.skillsTeaching.forEach(s => {
        if (s.approved) {
          skillMap.set(s.skill._id.toString(), s.skill);
        }
      });
    });

    res.json({ skills: Array.from(skillMap.values()) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Teachers for selected skill
const getTeachersBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const teachers = await User.find({
      isTeacher: true,
      skillsTeaching: {
        $elemMatch: { skill: skillId, approved: true }
      }
    }).select("name");

    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { dashboardData,getMe,getUserSkills,
  getAllSkills,
  addLearningSkill,
  deleteLearningSkill,
  addTeachingSkill,
  deleteTeachingSkill,
  updateLearningProgress, getBookableSkills, getTeachersBySkill};
