const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.post_user = function post_user(name, email) {
    var key = datastore.key(USER);
    const self_url = 'http://localhost:8080/user/' + key.id;
    const data = {
        'name': name,
        'email': email,
        'events': [],
        'todos': [],
        'notes': [],
        'self': self_url
    }

    return datastore.save({
        'key': key,
        'data': data
    }).then(() => { return key });
}

module.exports.post_event = function post_event(name, date) {
    var key = datastore.key(EVENT);
    const self_url = 'http://localhost:8080/calendar/' + key.id;
    const data = {
        "name": name,
        "date": date,
        "user_id": null,
        "self": self_url
    }

    return datastore.save({
        "key": key,
        "data": data
    }).then(() => { return key });
}

module.exports.post_note = function post_note(title, content) {
    var key = datastore.key(NOTE);
    const self_url = 'http://localhost:8080/note/' + key.id;
    const data = {
        "title": title,
        "content": content,
        "user_id": null,
        "self": self_url
    }

    return datastore.save({
        "key": key,
        "data": data
    }).then(() => { return key });
}

module.exports.post_todo = function post_todo(name, content) {
    var key = datastore.key(TODO);
    const self_url = 'http://localhost:8080/todo/' + key.id;
    const data = {
        'name': name,
        'content': content,
        'user_id': null,
        'self': self_url
    }

    return datastore.save({
        'key': key,
        'data': data
    }).then(() => { return key });
}