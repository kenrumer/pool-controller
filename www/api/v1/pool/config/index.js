'use strict';

const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const authzHandler = require('./../../../../middleware/authz-handler');
const queryParser = require('./../../../../middleware/query-parser');
const nocache = require('./../../../../middleware/no-cache');
const logger = require('./../../../../log');
const controller = require('./controller');

// Health check api
router.get('/health', (req, res, next) => {
    logger.debug('Inside Health Check');
    controller.getHealth(req, res);
});

router.post('/', jsonParser, (req, res, next) => {
    logger.debug('Inside config setConfig');
    controller.setConfig(req, res, next);
});

router.put('/', jsonParser, (req, res, next) => {
    logger.debug('Inside config setConfig');
    controller.setConfig(req, res, next);
});

router.get('/', (req, res, next) => {
    logger.debug('Inside config getConfig');
    controller.getConfig(req, res, next);
});

router.delete('/', (req, res, next) => {
    logger.debug('Inside config delete config');
    controller.deleteConfig(req, res, next);
});

module.exports = router;

