require('dotenv').config();

const config = {
    db: {
        host: process.env.MONGO_DB_HOST,
        name: process.env.MONGO_DB_NAME,
        user: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PASSWORD
    }
};
   
module.exports = config;   