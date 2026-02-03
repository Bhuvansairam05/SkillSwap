const mongoose = require("mongoose");
const Notification = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "NEW_TEACHER",
      "SESSION_CANCELLED",
      "SESSION_FAILED",
      "SKILL_ADDED","TEACHER_APPROVED",
  "TEACHER_REJECTED",
  "TEACHER_REMOVED"
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
  },
  skills:{
    type:Array
  },
  zoomlink:{
    type:String
  },
  approve:{
    type:Boolean,
    default:false
  },
  reject:{
    type:Boolean,
    default:false
  },
  actionStage: {
  type: String,
  enum: ["PENDING", "INTERVIEW_SENT", "COMPLETED"],
  default: "PENDING"
}


}, { timestamps: true });
module.exports = mongoose.model("Notification",Notification);