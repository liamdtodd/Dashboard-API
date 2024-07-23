const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.patch_user_event = function patch_user_event(uid, eid, user, event) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    event.self = 'http://localhost:8080/event/' + eid;
    event.user_id = uid;
    user.events.push(event);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }
    patch_event(uid, eid, event);
    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.patch_user_note = function patch_user_note(uid, nid, user, note) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    note.self = 'http://localhost:8080/note/' + nid;
    note.user_id = uid;
    user.notes.push(note);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }
    patch_note(uid, nid, note);
    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.patch_user_todo = function patch_user_todo(uid, tid, user, todo) {
    const key = datastore.key([USER, parseInt(uid, 10)]);
    todo.self = 'http://localhost:8080/todo/' + tid;
    todo.user_id = uid;
    user.todos.push(todo);

    const updated_user = {
        'id': uid,
        'name': user.name,
        'email': user.email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }
    patch_todo(uid, tid, todo);
    return datastore.save({ 'key': key, 'data': updated_user });
}

function patch_event(uid, eid, event) {
    const key = datastore.key([EVENT, parseInt(eid, 10)]);

    const updated_event = {
        'name': event.name,
        'date': event.date,
        'user_id': uid,
        'self': event.self
    }
    return datastore.save({ 'key': key, 'data': updated_event })
}

function patch_note(uid, nid, note) {
    const key = datastore.key([NOTE, parseInt(nid, 10)]);

    const updated_note = {
        'title': note.title,
        'content': note.content,
        'user_id': uid,
        'self': note.self
    }
    return datastore.save({ 'key': key, 'data': updated_note });
}

function patch_todo(uid, tid, todo) {
    const key = datastore.key([TODO, parseInt(tid, 10)]);
    
    const updated_todo = {
        'name': todo.name,
        'content': todo.content,
        'user_id': uid,
        'self': todo.self
    }
    return datastore.save({ 'key': key, 'data': updated_todo });
}