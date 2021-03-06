const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const SiteModel = require('../db/models/siteModel');
const DbConnector = require('../db/dbConnector');
const Job = require('../db/models/job');
const JobAnalysis = require('../db/models/jobAnalysis');
const AnalysisQueue =require('../db/models/analysisQueue');
const mongoose = require('mongoose');

router.put('/', Utils.asyncRoute(async function (req, res, next) {
    const {name, description, siteModelId, roomId, analysis} = req.body;
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


router.post('/analysis/:jobId', Utils.asyncRoute(async function (req, res, next) {
    const {jobId} = req.params;
    const {image, modelPrediction, analysisQueueId} = req.body
    const connector = new DbConnector();
    const timestamp = new Date().getTime();
    
    // Create the analysis
    const jobAnalysis = new JobAnalysis({
        jobId: jobId,
        timestamp: timestamp,
        modelPrediction: modelPrediction,
        image: image,
    });
    try {
        connector.connect();

        // Save and attach the analysis to the job
        const siteModel = await SiteModel.findOne({'rooms.jobs._id': mongoose.Types.ObjectId(jobId)}, 'rooms');
        const room = siteModel.rooms.find(room => typeof room.jobs.find(job => job._id.equals(jobId)) != 'undefined');
        const job = room.jobs.find(job => job._id.equals(jobId));
        job.analysis.unshift(jobAnalysis);
        room.lastAnalysedTimestamp = timestamp;
        job.lastAnalysisId = analysisQueueId;
        job.completed = modelPrediction >= 0.85;
        await siteModel.save();

        // get all jobs hooked to the analysis queue
        const analysisQueue = await AnalysisQueue.findById(analysisQueueId).exec();
        const jobsNeedingAnalysis = (
            await SiteModel.findOne(
                {
                    'rooms.jobs._id': {
                        $in: analysisQueue.jobs.map(job => mongoose.Types.ObjectId(job))
                    },
                }, 
                'rooms'
            ).lean().exec()
        )
            .rooms
            .flatMap(room => room.jobs)
            .filter(job => analysisQueue.jobs.includes(job._id) && job.lastAnalysisId != analysisQueueId);

        // set the analysis queue to completed if all the jobs have been analysed
        if (jobsNeedingAnalysis.length == 0) {
            analysisQueue.completed = true;
            analysisQueue.completedAt = new Date;
            await analysisQueue.save();
        }

        res.send([job, analysisQueue]);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

module.exports = router;