const Session = require("../models/Session");
const User = require("../models/User");
const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({
      $or: [{ learner: userId }, { teacher: userId }]
    })
      .populate("skill", "name")
      .populate("teacher", "name")
      .populate("learner", "name")
      .sort({ scheduledAt: -1 });

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    session.status = "completed";
    await session.save();

    // 🔥 Update learner progress
    await User.updateOne(
      {
        _id: session.learner,
        "skillsLearning.skill": session.skill
      },
      {
        $inc: { "skillsLearning.$.progress": 10 }
      }
    );

    res.json({ message: "Session marked as completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Session.findByIdAndUpdate(sessionId, {
      status: "cancelled"
    });

    res.json({ message: "Session cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// const createSession = async (req, res) => {
//   try {
//     const {
//       skillId,
//       teacherId,
//       learnerId,
//       scheduledAt,
//       duration,
//       creditsUsed
//     } = req.body;

//     const session = await Session.create({
//       skill: skillId,
//       teacher: teacherId,
//       learner: learnerId,
//       scheduledAt,
//       duration,
//       creditsUsed
//     });

//     // deduct learner credits
//     await User.findByIdAndUpdate(learnerId, {
//       $inc: { credits: -creditsUsed }
//     });

//     res.status(201).json({
//       message: "Session booked successfully",
//       session
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const getTeacherSessions = async (req, res) => {
  const sessions = await Session.find({ teacher: req.params.teacherId })
    .populate("skill", "name")
    .populate("learner", "name")
    .sort({ scheduledAt: -1 });

  res.json({ sessions });
};
const createSession = async (req, res) => {
  try {
    const {
      skillId,
      teacherId,
      learnerId,
      scheduledAt,
      duration,
      creditsUsed
    } = req.body;

    // 1️⃣ Fetch learner
    const learner = await User.findById(learnerId);

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // 2️⃣ Check credits (minimum 5)
    if (learner.credits < 5) {
      return res.status(400).json({
        message: "No credits to book session dude"
      });
    }

    // 3️⃣ Create session
    const session = await Session.create({
      skill: skillId,
      teacher: teacherId,
      learner: learnerId,
      scheduledAt,
      duration,
      creditsUsed
    });

    // 4️⃣ Deduct credits
    await User.findByIdAndUpdate(learnerId, {
      $inc: { credits: -creditsUsed }
    });

    res.status(201).json({
      message: "Session booked successfully",
      session
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveSessionByTeacher = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { meetingLink } = req.body;

    await Session.findByIdAndUpdate(sessionId, {
      meetingLink,
      status: "scheduled" // now it becomes active
    });
    console.log('successful')
    res.json({ message: "Session approved and meeting link added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {getUserSessions,completeSession,cancelSession,createSession,getTeacherSessions,approveSessionByTeacher}