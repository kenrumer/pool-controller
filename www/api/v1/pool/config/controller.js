'use strict';

const crypto = require('crypto');

const service = require('./service');
const logger = require('./../../../../log');

class ConfigController {

    constructor(service) {
        this.service = service;
        logger.debug('inside config controller');
    }

    getHealth(req, res) {
        return res.send('Health is up!');
    }

    getConfig(req, res, next) {
        var deviceId = req.get("Device-Id");
        var configType = req.get("Device-Config-Type");
        if (configType && deviceId) {
            this.configService.get(deviceId, {}).then((data) => {
                if (data) {
                    for (var i = 0; i < data.configs.length; i++) {
                        if (data.configs[i].configType == configType) {
                            this.configService.get(data.configs[i].configHash, {}).then((data1) => {
                                if (data1) {
                                    res.setHeader('Mti-Config-Hash', data1.hash);
                                    res.status(200).send(data1.body);
                                } else {
                                    res.status(404).send("Could not find config: " + configType + " for deviceId " + deviceId);
                                }
                            }).catch((err) => {
                                logger.error('Error while geting device config');
                                return next(err);
                            });
                        }
                    }
                } else {
                    res.sendStatus(404);
                }
            }).catch((err) => {
                logger.error('Error while geting device config');
                return next(err);
            });
        } else if (deviceId) {
            this.deviceConfigService.get(deviceId, {}).then((data) => {
                if (data) {
                    var ids = [];
                    var types = [];
                    for (var i = 0; i < data.configs.length; i++) {
                        ids.push(data.configs[i].configHash);
                        types.push(data.configs[i].configType);
                    }
                    this.configService.find( { _id: { $in: ids } }, {}).then((data1) => {
                        if (data1) {
                            res.setHeader('Mti-Config-Hash', data1.hash);
                            res.status(200).send(data1.body);
                        } else {
                            res.status(404).send("Could not find config: for deviceId " + deviceId);
                        }
                    }).catch((err) => {
                        logger.error('Error while geting device config files');
                        return next(err);
                    });
                } else {
                    res.status(404).send('Could not find device: ' + deviceId);
                }
            }).catch((err) => {
                logger.error('Error while geting device config');
                return next(err);
            });
        } else {
            res.status(400).send('Mti-Device-Id is required\nMti-Device-Config-Type is optional');
        }
    }

    setConfig(req, res, next) {
        var deviceId = req.get("Mti-Device-Id");
        var configType = req.get("Mti-Device-Config-Type");
        if (deviceId && configType) {
            var hash = crypto.createHash('md5').update(JSON.stringify(req.body)).digest("hex");
            var deviceConfig = {};
            this.deviceConfigService.get(deviceId, {}).then((data) => {
               if (data) {
                    deviceConfig = data;
                    var configs = deviceConfig['configs'];
                    var updated = false;
                    var configHash = 0;
                    for (var i = 0; i < configs.length; i++) {
                        if (configs[i].configType == configType) {
                            configs[i].configHash = hash;
                            updated = true;
                        }
                        configHash = configHash ^ configs[i].configHash;
                    }
                    if (!updated) {
                        var config = {
                            'configType': configType,
                            'configHash': hash
                        }
                        configHash = configHash ^ hash;
                        configs.push(config);
                    }
                    deviceConfig['configs'] = configs;
                    deviceConfig['configHash'] = configHash;
                } else {
                    //var configHash = crypto.createHash('md5').update(hash).digest("hex");
                    deviceConfig = {
                        '_id': deviceId,
                        'configHash': hash,
                        'configs': [{
                            'configType': configType,
                            'configHash': hash
                        }]
                    };
                }
                var config = {
                  '_id': hash,
                  'hash': hash,
                  'body': JSON.stringify(req.body)
                };
                this.deviceConfigService.update(deviceId, deviceConfig, {}).then((data) => {
                    if (data) {
                        this.configService.update(hash, config, {}).then((data1) => {
                            if (data1) {
                                res.status(201).send(data + "\n" + data1);
                            } else {
                                res.sendStatus(404);
                            }
                        }).catch((err) => {
                            logger.error('Error while setting device config');
                            return next(err);
                        });
                    } else {
                        res.sendStatus(404);
                    }
                }).catch((err) => {
                    logger.error('Error while setting device config');
                    return next(err);
                });
            });
        } else {
            res.status(400).send('Mti-Device-Id is required\nMti-Device-Config-Type is required');
        }
    }

    deleteConfig(req, res, next) {
        var configId = req.params.configId;
        this.configService.delete(configId, {}).then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        }).catch((err) => {
            logger.error('Error while geting device config');
            return next(err);
        });
    }
}

module.exports = new ConfigController(require('./service'));

