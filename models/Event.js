const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["Company Drive", "Assessment", "Interview", "GD", "Reminder"],
        required: true
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    date: {
        type: Date,
        required: true
    },

    description: {
        type: String
    },

    location: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Event", eventSchema);