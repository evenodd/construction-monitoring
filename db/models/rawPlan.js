const mongoose = require('mongoose');
const RawPlanSchema = require('./rawPlanSchema');

const RawPlan = mongoose.model('RawPlan', RawPlanSchema);

module.exports = RawPlan;