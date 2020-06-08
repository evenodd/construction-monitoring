const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const NodeConfig = require('../db/models/nodeConfig');
const DbConnector = require('../db/dbConnector');
const cors = require('cors');
const { sse } = require('@toverux/expresse');

var pollCache = {};

router.get('/search', cors(), Utils.asyncRoute(async function (req, res, next) {
    const connector = new DbConnector();
    connector.connect();
    const nodes = await NodeConfig.find().lean().exec();
    res.send(nodes);
}));

router.get('/:deviceId', cors(), Utils.asyncRoute(async function (req, res, next) {
    const { deviceId } = req.params;
    const connector = new DbConnector();
    connector.connect();
    const nodeConfig = await NodeConfig.findOne(
        { 'deviceId': deviceId }
    ).lean().exec();

    if (nodeConfig === null) {
        res.status(404).send('Device not found');
    } else {
        res.send(nodeConfig);
    }
}));

router.post('/register', Utils.asyncRoute(async function (req, res, next) {
    const {deviceId, deviceName} = req.body;
    const connector = new DbConnector();
    connector.connect();
    const nodeConfig = await NodeConfig.findOne(
        { 'deviceId': deviceId }
    ).lean().exec();

    if (nodeConfig != null) {
        res.status(422).send('Device has already been registered');
    } else {
        const newNode = new NodeConfig({
            deviceId: deviceId,
            deviceName: deviceName,
            roomId: null,
            analysisModels: []
        });
        newNode.save();
        res.send(newNode);
    }
}));

router.post('/:id', cors(), Utils.asyncRoute(async function (req, res, next) {
    const {roomId, analysisModels} = req.body;
    const { id } = req.params;

    const connector = new DbConnector();
    connector.connect();

    const nodeConfig = await NodeConfig.findById(id).exec();
    nodeConfig.roomId = roomId;
    nodeConfig.analysisModels = analysisModels;
    const saveResult = await nodeConfig.save();
    res.send(saveResult);

}));

router.get('/poll/:deviceId', sse({ flushHeaders: false }), Utils.asyncRoute(async function (req, res, next) {
    const { deviceId } = req.params;
    const connector = new DbConnector();
    connector.connect();
    
    while(true) {
        // 1 minute timeout on db polls
        const nodeConfig = await Promise.all([
            NodeConfig.findOne(
                { 'deviceId': deviceId }
            ).lean().exec(),
            Utils.timeout(60000)
        ]);

        if (nodeConfig === null) {
            res.status(404).send('Device not found');
            break;
        } else {
            if ((pollCache[deviceId] !== null || pollCache[deviceId] !== undefined) && pollCache[deviceId] == nodeConfig) {
                res.sse.event('unchanged', nodeConfig)
            } else {
                pollCache[deviceId] = nodeConfig
                res.sse.event('update', nodeConfig)
            }
        }
    }
}));

module.exports = router;