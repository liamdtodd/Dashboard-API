const ds = require("../../datastore/datastore");
const datastore = ds.datastore;

const { delete_event, delete_note, delete_todo } = require("../delete");

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.delete_user_event = function delete_user_event(uid, eid, user) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    const events = user.events.filter(event => event.id !== eid);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }
    delete_event(eid);
    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.delete_user_note = function delete_user_note(uid, nid, user) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    const notes = user.notes.filter(note => note.id !== nid);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': user.events,
        'notes': notes,
        'todos': user.todos,
        'self': user.self
    }
    delete_note(nid);
    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.delete_user_todo = function delete_user_todo(uid, tid, user) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    const todos = user.todos.filter(todo => todo.id !== tid);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': user.events,
        'notes': user.notes,
        'todos': todos,
        'self': user.self
    }
    delete_todo(tid);
    return datastore.save({ 'key': key, 'data': updated_user });
}