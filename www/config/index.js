var config = require('./default');

function replaceHost(service) {
    service.lb_url = service.lb_url.replace('<host>', service.host).replace('<port>', service.port);
    return service;
}

config.webgateway = replaceHost(config.webgateway);

if(config.file.path){
  require('mkpath').sync(config.file.path);
}

if(config.log.dir){
  require('mkpath').sync(config.log.dir);
}

module.exports = config;
