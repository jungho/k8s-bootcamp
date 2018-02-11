const winston = require('winston');
const {Console} = winston.transports;

const config = require('./config');


const logger = new winston.Logger({
    level: config.logLevel,
    transports: [
        new Console({
            handleExceptions: true,
            json: true,
            stringify: true
        })
    ]
});

module.exports = logger;