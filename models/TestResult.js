const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mockTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
    required: true
  },

  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      },
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }
  ],

  score: {
    type: Number,
    default: 0
  },

  totalQuestions: {
    type: Number,
    default: 0
  },

  percentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("TestResult", testResultSchema);