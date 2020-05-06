'use strict';

var Config = require('./model');
var PlatformService = require('./../../../../common/platform-service');
const logger = require('./../../../../log');
const config = require('./../../../config');

class ConfigService extends PlatformService {
    constructor(options) {
        super(options);
        logger.debug('inside config service');
    }
}

var configService = new ConfigService({
    Model: Config,
    idField: '_id'
});

module.exports = configService;

