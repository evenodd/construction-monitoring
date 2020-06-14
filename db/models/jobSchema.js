const mongoose = require('mongoose');
const JobAnalysisSchema = require('./jobAnalysisSchema')

const JobSchema = mongoose.Schema({
    name: String,
    description: String,
    completed:{
        type: Boolean,
        default: false
    },
    images: [Buffer],
    type: String,
    startTimestamp: Number,
    endTimestamp: Number,
    analysis: [JobAnalysisSchema],
    lastAnalysisId: {
        type: String,
        default: null
    }
});

module.exports = JobSchema;