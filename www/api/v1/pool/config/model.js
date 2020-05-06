const mongoose = require('mongoose');
const flat = require('flat');

const Schema = mongoose.Schema;

const configSchema = new Schema({
    _id: String,
    hash: String,
    body: String
}, {
    collection: 'configs',
    strict: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;

