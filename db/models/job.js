const mongoose = require('mongoose');
const JobSchema = require('./jobSchema');
const Job = mongoose.model('Job', JobSchema);

module.exports = Job;