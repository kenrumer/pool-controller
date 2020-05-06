'use strict';

var log = require('./log');
var http = require('./httpserver');

var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-paginate'));

const config = require('./config');
const routes = require('./routes');
mongoose.connect(config.mongodb.url);

http.start(config.http, function(err, server, app) {
    routes(app);
});
