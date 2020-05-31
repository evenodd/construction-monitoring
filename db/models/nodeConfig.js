const mongoose = require('mongoose');
const NodeConfigSchema = require("./nodeConfigSchema");

const NodeConfig = mongoose.model('NodeConfig', NodeConfigSchema, 'nodeConfig');

module.exports = NodeConfig;