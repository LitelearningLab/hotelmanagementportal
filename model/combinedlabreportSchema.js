const mongoose = require("mongoose");

const combinedLabReportSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    date: {
        type: String, // Store the date in 'YYYY-MM-DD' format for easy querying
        required: true
    },
    callFlowData: {
        type: Object,
        default: {}
    }, // Store call flow-related data
    sentenceData: {
        type: Object,
        default: {}
    }, // Store sentence-related data
    combinedScore: {
        type: Number,
        default: 0
    }, // Aggregate score from both reports
    combinedPracticeAttempts: {
        type: Number,
        default: 0
    }, // Sum of practice attempts from both
    listeningAttempts: {
        type: Number,
        default: 0
    }, // Sum of listening attempts
}, {
    timestamps: true
});

const combinedLabReport = mongoose.model("combinedLabReport", combinedLabReportSchema);
module.exports = combinedLabReport;
