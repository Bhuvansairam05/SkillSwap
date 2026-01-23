const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  scheduledAt: {
    type: Date,
    required: true
  },

  duration: {
    type: Number, // minutes
    required: true
  },

  meetingLink: {
    type: String
  },

  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  },

  creditsUsed: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
