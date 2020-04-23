var express = require('express');
var router = express.Router();
const DbConnector = require('../db/dbConnector');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Hey, this is the api powered with express :P');
});

router.get('/health', async function(req, res, next) {
    let db = new DbConnector();
    db.connect()
    let dbHealth = await db.health();
    
    res.status(dbHealth.healthy ? 200: 500).send({
        db: dbHealth
    });
});

module.exports = router;
