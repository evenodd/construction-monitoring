const mongoose = require('mongoose');

const RawPlanSchema = mongoose.Schema({
    data: Buffer
});

module.exports = RawPlanSchema;