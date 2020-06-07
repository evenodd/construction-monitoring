const mongoose = require('mongoose');

const JobAnalysisSchema = mongoose.Schema({
    jobId: mongoose.Schema.ObjectId,
    timestamp: Number,
    modelPrediction: Number,
    thumbnail: Buffer,
    image: Buffer,
});

module.exports = JobAnalysisSchema;