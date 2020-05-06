var errorHandler = require('./middleware/error-handler');
var config = require('./config');
const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
//var jwt = require('jsonwebtoken');
var jwt = require("express-jwt");
var unless = require('express-unless');
const jsonParser = require('body-parser').json();
const cors = require('cors');

module.exports = function(app) {

    app.use('/info', function(req, res, next) {
        res.send(config);
    });

    app.use(require('compression')());
    app.use(require('response-time')());
    app.use(bodyParser.json({
//        limit: '50mb',
        verify: function(req, res, buf, encoding) {
            req.rawBody = buf.toString();
        }
    }));
    app.use(cors());
    if (config.token.enabled) {
        app.use(jwt({secret: config.token.secret}).unless({path: ['/info', '/v1/user/enroll', '/v1/user/passcode', '/v1/user/token', '/v1/user/refresh'] }));
    }
//    app.use('/v1/report', require('./api/v1/report'));
//    app.use('/v1/callback', require('./api/v1/callback'));
//    app.use('/v1/device/config', require('./api/v1/device/config'));
//    app.use('/v1/device/score', require('./api/v1/device/score'));
    app.use('/v1/pool/config', require('./api/v1/pool/config'));
    app.use('/v1/user', require('./api/v1/user'));
    app.use(errorHandler);
}
