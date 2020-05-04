const mongoose = require('mongoose');
const JobSchema = require('./jobSchema')
const RoomSchema = mongoose.Schema({
    name: String,
    jobs: [JobSchema]
});

module.exports = RoomSchema;