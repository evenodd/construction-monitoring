const mongoose = require('mongoose');

const AnalysisQueueSchema = mongoose.Schema({
    roomId: String,
    completed: {
        type: Boolean,
        default: false
    },
    jobs: [String],
    createdAt: {
        type: Date,
        default: new Date
    },
    completedAt: {
        type: Date,
        default: null

    }
});

module.exports = AnalysisQueueSchema;