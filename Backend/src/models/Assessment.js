const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],

  timeLimit: {
    type: Number, // minutes
    required: true
  },

  passingScore: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Assessment", AssessmentSchema);
