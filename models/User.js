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

  phone: {
    type: String,
    default: ""
  },

  profilePic: {
    type: String,
    default: ""
  },

  college: String,
  department: String,
  year: Number,
  cgpa: Number,

  skills: {
    type: [String],
    default: []
  },

  targetCompanies: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },

  bookmarks: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },

  dailyTasks: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  prepProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  codingProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  scheduleEvents: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);