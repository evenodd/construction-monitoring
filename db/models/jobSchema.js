const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    name: String,
    description: String,
    completed:{
        type: Boolean,
        default: false
    },
    images: [Buffer]
});

module.exports = JobSchema;