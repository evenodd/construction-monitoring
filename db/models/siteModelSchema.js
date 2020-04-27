const mongoose = require('mongoose');

const SiteModelSchema = mongoose.Schema({
    name: String,
    type: String,
    data: Buffer
});

module.exports = SiteModelSchema;