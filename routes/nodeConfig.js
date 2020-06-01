const express = require('express');
const router = express.Router();
const Utils = require('./routeUtils');
const NodeConfig = require('../db/models/nodeConfig');
const DbConnector = require('../db/dbConnector');
const cors = require('cors');

router.get('/:deviceId', cors(), Utils.asyncRoute(async function (req, res, next) {
    const { deviceId } = req.params;
    const connector = new DbConnector();
    console.log(deviceId);
    connector.connect();

    console.log(NodeConfig);

    const nodeConfig = await NodeConfig.findOne(
        { 'deviceId': deviceId }
    ).lean().exec();

    console.log(nodeConfig);

    res.send(nodeConfig);
}));

module.exports = router;