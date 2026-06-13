const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    enum: ["student", "admin"],
    default: "student"
  },

  college: String,
  department: String,
  year: Number,
  cgpa: Number,

  skills: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);