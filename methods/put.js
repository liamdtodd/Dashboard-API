const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.put_user = function put_user(id, user, name, email) {
    const key = datastore.key([USER, parseInt(id, 10)]);
    const self_url = 'http://localhost:8080/user/' + id;

    const updated_user = {
        'id': id,
        'name': name,
        'email': email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': self_url
    }

    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.put_event = function put_event(id, event, name, date) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    const self_url = 'http://localhost:8080/calendar/' + id;

    const updated_event = {
        'id': id,
        'name': name,
        'date': date,
        'user_id': event.user_id,
        'self': self_url
    }

    return datastore.save({ 'key': key, 'data': updated_event });
}

module.exports.put_note = function put_note(id, note, title, content) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);
    const self_url = 'http://localhost:8080/note/' + id;

    const updated_event = {
        'id': id,
        'title': title,
        'content': content,
        'user_id': note.user_id,
        'self': self_url
    }

    return datastore.save({ 'key': key, 'data': updated_event });
}

module.exports.put_todo = function put_todo(id, todo, name, content) {
    const key = datastore.key([TODO, parseInt(id, 10)]);
    const self_url = 'http://localhost:8080/todo/' + id;

    const updated_todo = {
        'id': id,
        'name': name,
        'content': content,
        'user_id': todo.user_id,
        'self': self_url
    }

    return datastore.save({ 'key': key, 'data': updated_todo });
}