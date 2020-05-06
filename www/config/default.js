var config = {
    http: {
        httpPort: 8080,
        secureHTTP: false,
    },

    token: {
        enabled: false,
        secret: '09152016',
        expires: 60,
        username: 'system1',
        password: '1ctgtest01'
    },

    mongodb: {
        url: 'mongodb://localhost/web-gateway?poolSize=2&autoReconnect=true&bufferMaxEntries=100&maxTimeMS=1000'
    },

    webgateway: {
        lb_url: '<host>:<port>',
        protocol: 'http',
        host: 'localhost',
        port: 8081
    },

    log: {
        level: 'debug',
        dir: 'log',
        fileName: 'web-gateway.log'
    },

};

module.exports = config;
