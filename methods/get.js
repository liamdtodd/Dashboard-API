const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.get_user = function get_user(id) {
    const key = datastore.key([USER, parseInt(id, 10)]);
    return datastore.get(key).then((user) => {
        if (user[0] === undefined || user[0] === null)
            return user
        else
            return user.map(ds.fromDatastore);
    });
}

module.exports.get_users = function get_users() {
    const query = datastore.createQuery(USER);
    return datastore.runQuery(query).then((users) => {
        return users[0].map(ds.fromDatastore);
    });
}

module.exports.create_user = function create_user(data) {
    var key = datastore.key(USER);
    const self_url = 'http://localhost:8080/user/' + key.id;
    const new_user = {
        'name': data.nickname, 
        'email': data.email,
        'sub': data.sub,
        'events': [],
        'notes': [],
        'todos': [],
        'self': self_url
    }

    console.log('user: ', new_user);

    return datastore.save({'key': key, 'data': new_user });
}

module.exports.get_event = function get_event(id) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    return datastore.get(key).then((event) => {
        if (event[0] === undefined || event[0] === null) 
            return event;
        else
            return event.map(ds.fromDatastore);
    });
}

module.exports.get_todo = function get_todo(id) {
    const key = datastore.key([TODO, parseInt(id, 10)]);
    return datastore.get(key).then((todo) => {
        if (todo[0] === undefined || todo[0] === null)
            return todo
        else
            return todo.map(ds.fromDatastore);
    });
}

module.exports.get_note = function get_note(id) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);
    return datastore.get(key).then((note) => {
        if (note[0] === undefined || note[0] === null)
            return note;
        else
            return note.map(ds.fromDatastore);
    });
}