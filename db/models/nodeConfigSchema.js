const mongoose = require('mongoose');

const NodeConfigSchema = mongoose.Schema({
    deviceId: String,
    deviceName: String,
    roomId: String,
    analysisModels: [String],
});

module.exports = NodeConfigSchema;