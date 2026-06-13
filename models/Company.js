const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    ctc: {
        type: Number,
        required: true
    },
    eligibilityCgpa: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    description: String,
    location: String
});

module.exports = mongoose.model("Company", companySchema);