const mongoose = require('mongoose');
const JobAnalysisSchema = require('./jobAnalysisSchema');
const JobAnalysis = mongoose.model('JobAnalysis', JobAnalysisSchema);

module.exports = JobAnalysis;