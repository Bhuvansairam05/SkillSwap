const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  freeVideos: [
    {
      title: String,
      videoUrl: String,
      duration: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Skill", SkillSchema);
