const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const SiteModel = require('../db/models/siteModel');
const DbConnector = require('../db/dbConnector');
const Job = require('../db/models/job');
const mongoose = require('mongoose');

router.put('/', Utils.asyncRoute(async function (req, res, next) {
    const {name, description, siteModelId, roomId} = req.body;
    const connector = new DbConnector();
    const job = new Job({
        name: name,
        description: description,
        images: [],

    });
    try {
        connector.connect();
        const siteModel = await SiteModel.findById(siteModelId).select("rooms").exec();
        const room = siteModel.rooms.find(room => room._id = mongoose.Types.ObjectId(roomId))
        room.jobs.push(job);
        siteModel.save();
        res.send(job);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
    res.send(room);
}));

module.exports = router;