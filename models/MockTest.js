const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["Aptitude", "Logical", "Verbal", "Technical", "Coding"],
    required: true
  },

  durationMinutes: {
    type: Number,
    default: 30
  },

  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],

  totalMarks: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("MockTest", mockTestSchema);