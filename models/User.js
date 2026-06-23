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
    type: [String],
    default: []
  },

  bookmarks: [{
    type: { type: String },
    itemId: String,
    title: String,
    createdAt: { type: Date, default: Date.now }
  }],

  dailyTasks: [{
    taskId: String,
    title: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],

  prepProgress: [{
    category: String,
    topic: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],

  codingProgress: [{
    category: String,
    topic: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],

  scheduleEvents: [{
    title: String,
    startDate: Date,
    endDate: Date,
    status: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);