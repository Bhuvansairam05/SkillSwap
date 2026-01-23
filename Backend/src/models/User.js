const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  isTeacher: {
    type: Boolean,
    default: false
  },

  credits: {
    type: Number,
    default: 0
  },

  skillsLearning: [
    {
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      },
      progress: {
        type: Number,
        default: 0
      }
    }
  ],

  skillsTeaching: [
    {
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      },
      approved: {
        type: Boolean,
        default: false
      }
    }
  ],

  rating: {
    type: Number,
    default: 0
  },

  totalSessionsTaken: {
    type: Number,
    default: 0
  },

  totalSessionsGiven: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
