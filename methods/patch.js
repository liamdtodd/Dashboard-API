const ds = require("../datastore/datastore");
const datastore = ds.datastore;

const USER = 'USER';
const EVENT = 'EVENT';
const NOTE = 'NOTE';
const TODO = 'TODO';

module.exports.patch_user_name = function patch_user_name(id, user, name) {
    const key = datastore.key([USER, parseInt(id, 10)]);

    const updated_user = {
        'id': id,
        'name': name,
        'email': user.email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }

    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.patch_user_email = function patch_user_email(id, user, email) {
    const key = datastore.key([USER, parseInt(id, 10)]);

    const updated_user = {
        'id': id,
        'name': user.name,
        'email': email,
        'events': user.events,
        'notes': user.notes,
        'todos': user.todos,
        'self': user.self
    }

    return datastore.save({ 'key': key, 'data': updated_user });
}

module.exports.patch_event_name = function patch_event_name(id, event, name) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    
    const updated_event = {
        'id': id,
        'name': name,
        'date': event.date,
        'user_id': event.user_id,
        'self': event.self
    }

    return datastore.save({ 'key': key, 'data': updated_event });
}

module.exports.patch_event_date = function patch_event_date(id, event, date) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);

    const updated_event = {
        'id': id, 
        'name': event.name,
        'date': date,
        'user_id': event.user_id,
        'self': event.self
    }

    return datastore.save({ 'key': key, 'data': updated_event });
}

module.exports.patch_note_title = function patch_note_title(id, note, title) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);

    const updated_note = {
        'id': id,
        'title': title,
        'content': note.content,
        'user_id': note.user_id,
        'self': note.self
    }

    return datastore.save({ 'key': key, 'data': updated_note });
}

module.exports.patch_note_content = function patch_note_content(id, note, content) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);

    const updated_note = {
        'id': id,
        'title': note.title,
        'content': content,
        'user_id': note.user_id,
        'self': note.self
    }

    return datastore.save({ 'key': key, 'data': updated_note });
}

module.exports.patch_todo_name = function patch_todo_name(id, todo, name) {
    const key = datastore.key([TODO, parseInt(id, 10)]);

    const updated_todo = {
        'id': id,
        'name': name,
        'content': todo.content,
        'user_id': todo.user_id,
        'self': todo.self
    }

    return datastore.save({ 'key': key, 'data': updated_todo });
}

module.exports.patch_todo_content = function patch_todo_content(id, todo, content) {
    const key = datastore.key([TODO, parseInt(id, 10)]);

    const updated_todo = {
        'id': id,
        'name': todo.name,
        'content': content,
        'user_id': todo.user_id,
        'self': todo.self
    }

    return datastore.save({ 'key': key, 'data': updated_todo });
}