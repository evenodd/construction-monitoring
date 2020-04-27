const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SiteModel = require('../db/models/siteModel');
const DbConnector = require('../db/dbConnector')
const Utils = require('./routeUtils');

router.put('/', Utils.asyncRoute(async function(req, res, next) {
    let siteModel = new SiteModel({
        name: req.body.name,
        type: req.files.file.name.split('.').slice(-1)[0],
        data: req.files.file.data
    });
    const connector = new DbConnector();
    let saveResult;
    try {
        connector.connect();
        saveResult = await siteModel.save();
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
    console.log(saveResult);
    res.send({
        msg: saveResult
    });
}));

module.exports = router;