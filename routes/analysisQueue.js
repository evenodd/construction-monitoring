var express = require('express');
var router = express.Router();
const DbConnector = require('../db/dbConnector');
const AnalysisQueue =require('../db/models/analysisQueue');
const Utils = require('./routeUtils');

router.get('/pending/:roomId',  Utils.asyncRoute(async function (req, res, next) {
    const { roomId } = req.params;
    const connector = new DbConnector();
    try {
        connector.connect();
        const uncompletedAnalysis = await AnalysisQueue.findOne({
            completed: false,
            roomId: roomId
        }).lean().exec();
        res.send(uncompletedAnalysis != null);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

}));

router.post('/', Utils.asyncRoute(async function (req, res, next) {
    const { roomId } = req.body;
    const connector = new DbConnector();
    const analysisQueue = new AnalysisQueue({
        roomId: roomId
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
            saveResult = await analysisQueue.save();
            res.send(saveResult);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}));

module.exports = router;