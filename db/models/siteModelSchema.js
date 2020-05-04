const RawPlanSchema = require('./rawPlanSchema')
const mongoose = require('mongoose');
const RoomSchema = require('./roomSchema')
const SiteModelSchema = mongoose.Schema({
    name: String,
    type: String,
    data: RawPlanSchema,
    rooms: [RoomSchema]
});

module.exports = SiteModelSchema;