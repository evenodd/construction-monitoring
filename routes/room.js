const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const SiteModel = require('../db/models/siteModel');
const Room = require('../db/models/room');
const DbConnector = require('../db/dbConnector');
const mongoose = require('mongoose');

router.get('/site/:siteModelId', Utils.asyncRoute(async function (req, res, next) {
    const {siteModelId} = req.params;
    const connector = new DbConnector();
    connector.connect();
    try {
        siteModel = await SiteModel.findById(siteModelId).select('rooms').lean().exec();
        res.send(siteModel.rooms);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

router.get('/:id', Utils.asyncRoute(async function (req, res, next) {
    const {id} = req.params;
    const connector = new DbConnector();
    try {
        connector.connect();
        const room = await SiteModel.findOne(
            {'rooms._id': mongoose.Types.ObjectId(id)}, {'rooms.$': true}
        ).lean().exec();

        res.send(room);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

router.put('/', Utils.asyncRoute(async function (req, res, next) {
    const {name, siteModelId} = req.body;
    const connector = new DbConnector();
    const room = new Room({
        name: name,
        jobs: []
    });
    try {
        connector.connect();
        const siteModel = await SiteModel.findById(siteModelId).select('rooms').exec();
        siteModel.rooms.push(room);
        siteModel.save();
        res.send(room);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
    res.send(room);
}));

module.exports = router;