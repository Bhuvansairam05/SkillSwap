const mongoose = require("mongoose");
const Notification = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "NEW_TEACHER",
      "SESSION_CANCELLED",
      "SESSION_FAILED",
      "SKILL_ADDED"
    ],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId
    // teacherId / sessionId / skillId
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });
module.exports = mongoose.model("Notification",Notification);