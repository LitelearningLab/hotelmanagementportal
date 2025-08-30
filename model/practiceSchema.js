const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    totalPracticeTime: { 
        type: Number, 
        default: 0 
    }, // Total practice time in seconds
    currentSessionStart: { 
        type: Date 
    },
    practicetype: {
        type: String,
        enum: [
            "Pronunciation Lab Report", 
            "Sentence Construction Lab Report", 
            "Call Flow Practise Report", 
            "Sound-wise Report",
            "Pronunciation Sound Lab Report"
        ],
        required: true // Assuming this field is required
    },
    date: {
        type: String,
        required: true
    },
    score: {
        type: [Number],
        default: []
    },
    listeningcount: {
        type: Number,
        default: 0
    },
    practicecount: {
        type: Number,
        default: 0
    },
    successCount: {
        type: [String], 
        enum: ["correct", "wrong"], 
        default: [] 
    },
    userDetails: {}
}, 
{
    timestamps: true
});

const practice = mongoose.model("practice", practiceSchema);

module.exports = practice;
