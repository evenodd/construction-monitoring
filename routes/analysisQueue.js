var express = require('express');
var router = express.Router();
const DbConnector = require('../db/dbConnector');
const AnalysisQueue =require('../db/models/analysisQueue');
const Utils = require('./routeUtils');
const NodeConfig = require('../db/models/nodeConfig');
const SiteModel = require('../db/models/siteModel');
const Job = require('../db/models/job');
const mongoose = require('mongoose');

router.get('/pending/:roomId',  Utils.asyncRoute(async function (req, res, next) {
    const { roomId } = req.params;
    const connector = new DbConnector();
    try {
        connector.connect();
        const pendingAnalysis = await AnalysisQueue.findOne({
            completed: false,
            roomId: roomId
        }).lean().exec();

        res.send({
            id:  (pendingAnalysis != null) ? pendingAnalysis._id : null,
            pendingAnalysis: pendingAnalysis != null,
            jobs: (pendingAnalysis != null) ? pendingAnalysis.jobs : []
        });
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

}));

router.post('/', Utils.asyncRoute(async function (req, res, next) {
    const { roomId } = req.body;
    const connector = new DbConnector();
    const analysisQueue = new AnalysisQueue({
        roomId: roomId,
        jobs: []
    });
    try {
        connector.connect();
        const uncompletedAnalysis = await AnalysisQueue.findOne({
            completed: false,
            roomId: roomId
        }).lean().exec();

        if (uncompletedAnalysis != null) {
            console.error(uncompletedAnalysis)
            res.status(422).send('Pending analysis for room');
        } else {
            const siteModel = await SiteModel.findOne({'rooms._id': mongoose.Types.ObjectId(roomId)}).exec()
            const room = siteModel.rooms.find(room => room._id.equals(roomId));;

            const analysisModels = new Set(
                (
                    await NodeConfig.find({roomId: roomId})
                        .lean()
                        .select('analysisModels')
                        .exec()
                )
                    .flatMap(nodeConfig => nodeConfig.analysisModels)
                    .map(model => model.replace('_', ' ').toLowerCase())
            );

            const jobs = new Set(room.jobs.map(job =>job.name.replace('_', ' ').toLowerCase()));
            const newJobs = [...analysisModels]
                .filter(model => !jobs.has(model))
                .map(model => new Job({
                    name: model,
                    description: '',
                    images: [],
                    startTimestamp: new Date().getTime(),
                    analysis: [],
                }));
            room.jobs.push(...newJobs);

            const jobIds = room.jobs
                .filter(job => analysisModels.has(job.name.replace('_', ' ').toLowerCase()))
                .map(job => job._id);
            analysisQueue.jobs.push(...jobIds);

            const analysisQueueResult = await analysisQueue.save();
            const siteModelResult = await siteModel.save();
            res.send([analysisQueueResult, siteModelResult]);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

module.exports = router;