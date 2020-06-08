const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const SiteModel = require('../db/models/siteModel');
const DbConnector = require('../db/dbConnector');
const Job = require('../db/models/job');
const JobAnalysis = require('../db/models/jobAnalysis');
const mongoose = require('mongoose');

router.put('/', Utils.asyncRoute(async function (req, res, next) {
    const {name, description, siteModelId, roomId} = req.body;
    const connector = new DbConnector();
    const job = new Job({
        name: name,
        description: description,
        images: [],
        startTimestamp: new Date().getTime(),
        analysis: [],
    });
    try {
        connector.connect();
        const siteModel = await SiteModel.findById(siteModelId).select('rooms').exec();
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

router.get('/:jobId', Utils.asyncRoute(async function (req, res, next) {
    const {jobId} = req.params;
    const connector = new DbConnector();
    try {
        connector.connect();
        const siteModel = await SiteModel.findOne({'rooms.jobs._id': mongoose.Types.ObjectId(jobId)}, {'rooms.jobs.$': true})
        .sort({timestamp: 1}).exec();
        const job = siteModel.rooms[0].jobs.find(job => job._id.equals(jobId));
        
        res.send(job);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

router.put('/test-analysis/:jobId', Utils.asyncRoute(async function (req, res, next) {
    const {jobId} = req.params;
    const connector = new DbConnector();
    const timestamp = new Date().getTime();
    const jobAnalysis = new JobAnalysis({
        timestamp: timestamp,
        modelPrediction: 0.5,
    });
    try {
        connector.connect();

        const siteModel = await SiteModel.findOne({'rooms.jobs._id': mongoose.Types.ObjectId(jobId)}, {'rooms.jobs.$': true});
        const job = siteModel.rooms[0].jobs.find(job => job._id.equals(jobId));
        
        job.analysis.unshift(jobAnalysis);

        siteModel.rooms[0]['lastAnalysedTimestamp'] = timestamp;
        
        siteModel.save();

        res.send(job);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));


module.exports = router;