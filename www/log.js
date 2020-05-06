var winston = require('winston');
const config = require('./config');

var logger = new(winston.Logger)({
    level: config.log.level,
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({
            filename: config.log.dir + '/' + config.log.fileName
        })
    ]
});

module.exports = logger;
