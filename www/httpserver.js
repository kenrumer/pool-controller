var express = require('express');
var app = express();
var log = require('./log');
var fs = require('fs');

var server;

function createServer(config, doneCB) {
    log.debug('Using HTTP');
    var http = require('http');

    server = http.createServer(app);
    server.listen(config.httpPort);
    doneCB(null, server);
}

function start(config, doneCB) {
    createServer(config, function(err, server) {
        doneCB(null, server, app);
    });
};

module.exports = {
    start: start
}
