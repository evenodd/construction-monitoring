const mongoose = require('mongoose');
const AnalysisQueueSchema = require('./analysisQueueSchema');
const AnalysisQueue = mongoose.model('AnalysisQueue', AnalysisQueueSchema);

module.exports = AnalysisQueue;