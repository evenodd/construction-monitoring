const mongoose = require('mongoose');
const config = require('../config');

class DbConnector {
    constructor() {
        this.uri =`mongodb+srv://${config.db.user}:${config.db.password}@${config.db.host}/${config.db.name}`;
    }

    connect() {
        mongoose.connect(this.uri,  { useNewUrlParser: true , useUnifiedTopology: true});
        return mongoose.connection;
    }

    async health() {
        return new Promise((resolve) => {
            mongoose.connection.on('connected', () => {
                resolve({
                    healthy: true,
                    msg: "Connected"
                });
            });

            mongoose.connection.on('error', (err) => {
                resolve({
                    healthy: false,
                    msg: err
                });
            });
        });
    }


}

module.exports = DbConnector