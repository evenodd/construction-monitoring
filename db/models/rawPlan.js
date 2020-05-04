const mongoose = require('mongoose');
const RawPlabSchema = require('./rawPlanSchema');

const RawPlan = mongoose.model('RawPlan', RawPlabSchema);

module.exports = RawPlan;