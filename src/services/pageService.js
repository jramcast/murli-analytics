const pageSchema = require('../models/pageSchema');


function create(args, resolve, reject) {
    pageSchema.create(args, (err, page) => {
        if (err) {
            reject(err, null);
        } else {
            resolve(null, page);
        }
    });
}

function getAll(callback) {
    pageSchema.find({}, (err, pages) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, pages);
        }
    });
}

function getByToken(pageToken, callback) {
    pageSchema.findOne({ pageToken }, (err, page) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, page);
        }
    });
}

module.exports = {
    create,
    getAll,
    getByToken
};
