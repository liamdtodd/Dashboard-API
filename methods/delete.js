const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.delete_user = function delete_user(id) {
    const key = datastore.key([USER, parseInt(id, 10)]);
    return datastore.delete(key);
}

module.exports.delete_event = function delete_event(id) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    return datastore.delete(key);
}

module.exports.delete_note = function delete_note(id) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);
    return datastore.delete(key);
}

module.exports.delete_todo = function delete_todo(id) {
    const key = datastore.key([TODO, parseInt(id, 10)]);
    return datastore.delete(key);
}