const express = require('express');
const router = express.Router();
const SiteModel = require('../db/models/siteModel');
const DbConnector = require('../db/dbConnector')
const Utils = require('./routeUtils');
const RawPlan = require('../db/models/rawPlan');

router.put('/', Utils.asyncRoute(async function (req, res, next) {
    let rawPlan = new RawPlan({
        data: req.files.file.data
    });
    let siteModel = new SiteModel({
        name: req.body.name,
        type: req.files.file.name.split('.').slice(-1)[0],
        data: rawPlan,
        rooms: []
    });
    const connector = new DbConnector();
    let saveResult;
    try {
        connector.connect();
        saveResult = await siteModel.save();
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    res.send({
        msg: saveResult
    });
}));

router.get('/:id/image', Utils.asyncRoute(async function (req, res, next) {
    const connector = new DbConnector();
    const {id} = req.params;
    connector.connect();
    try {
        const siteModel = await SiteModel.findById(id).select("data type").lean().exec();
        res.writeHead(200, {
        'Content-Type': `image/${siteModel.type}`,
        'Content-Length': siteModel.data.data.length()
        });
        res.end(siteModel.data.data.buffer); 

    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

router.get('/:id', Utils.asyncRoute(async function (req, res, next) {
    const connector = new DbConnector();
    const {id} = req.params;
    connector.connect();
    try {
        const siteModel = await SiteModel.findById(id).select("name type rooms").lean().exec();
        res.send(siteModel);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));


router.get('/', Utils.asyncRoute(async function (req, res, next) {
    const connector = new DbConnector();
    connector.connect();
    try {
        collection = await SiteModel.find().select("name type").lean().exec();
        res.send(collection);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

module.exports = router;