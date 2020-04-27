const mongoose = require('mongoose');
const SiteModelSchema = require('./siteModelSchema');
const SiteModel = mongoose.model('SiteModel', SiteModelSchema);

module.exports = SiteModel;