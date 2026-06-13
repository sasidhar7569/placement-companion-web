const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: [
            "Aptitude",
            "Coding",
            "DBMS",
            "OS",
            "CN",
            "OOPS",
            "HR Interview",
            "Technical Interview"
        ],
        required: true
    },

    description: {
        type: String
    },

    link: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Resource", resourceSchema);