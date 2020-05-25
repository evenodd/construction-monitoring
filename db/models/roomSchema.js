const mongoose = require('mongoose');
const JobSchema = require('./jobSchema');

const RoomSchema = mongoose.Schema({
    name: String,
    coords: String,
    jobs: [JobSchema]
});

module.exports = RoomSchema;