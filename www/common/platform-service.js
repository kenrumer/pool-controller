'use strict';

class PlatformService {

    constructor(options) {
        this.options = {
            idField: '_id'
        };
        this.options = Object.assign(this.options, options);
    }

    find(params) {
        return new Promise((resolve, reject) => {
            this.options.Model.find(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    paginate(query, options) {
        return new Promise((resolve, reject) => {
            this.options.Model.paginate(query, options, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    get(id, params) {
        return new Promise((resolve, reject) => {
            var config = {};
            config[this.options.idField] = id;
            this.options.Model.findOne(config, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    create(data, params) {
        return new Promise((resolve, reject) => {
            this.options.Model.create(data, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    saveOrUpdateAll(data) {
        return new Promise((resolve, reject) => {
            this.options.Model.saveOrUpdateAll(data, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    delete(id, params) {
        var config = {};
        config[this.options.idField] = id;

        return new Promise((resolve, reject) => {
            this.options.Model.findOneAndRemove(config, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    save(id, data, params) {
        if (id == null) {
            return this.create(data, params);
        } else {
            return this.update(id, data, params);
        }
    }

    updateAll(query, data) {
        return new Promise((resolve, reject) => {
            this.options.Model.update(query, data, {
                multi: true
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    update(id, data, params) {
        var config = {};
        config[this.options.idField] = id;

        return new Promise((resolve, reject) => {
            this.options.Model.findOneAndUpdate(config, data, {
                new: true,
                upsert: true
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });

        });
    }

    aggregate(data) {
        return new Promise((resolve, reject) => {
            this.options.Model.aggregate(data, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = PlatformService;

