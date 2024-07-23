const express = require('express');
const bodyParser = require('body-parser');
const ds = require('../datastore/datastore');
const datastore = ds.datastore;
const router = express.Router();

const USER = 'USER';
const EVENT = 'EVENT';
const TODO = 'TODO';
const NOTE = 'NOTE';
const JSON = 'application/json';

router.use(bodyParser.json());

function post_user(name, email) {
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

function get_user(id) {
    const key = datastore.key([USER, parseInt(id, 10)]);
    return datastore.get(key).then((user) => {
        if (user[0] === undefined || user[0] === null)
            return user
        else
            return user.map(ds.fromDatastore);
    });
}

function patch_user_event(uid, eid, user, event) {
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

function patch_user_note(uid, nid, user, note) {
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

function patch_user_todo(uid, tid, user, todo) {
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

function get_event(id) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    return datastore.get(key).then((event) => {
        if (event[0] === undefined || event[0] === null) 
            return event;
        else
            return event.map(ds.fromDatastore);
    });
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

function get_note(id) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);
    return datastore.get(key).then((note) => {
        if (note[0] === undefined || note[0] === null)
            return note;
        else
            return note.map(ds.fromDatastore);
    });
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

function get_todo(id) {
    const key = datastore.key([TODO, parseInt(id, 10)]);
    return datastore.get(key).then((todo) => {
        if (todo[0] === undefined || todo[0] === null)
            return todo
        else
            return todo.map(ds.fromDatastore);
    });
}

function patch_todo(uid, tid, todo) {
    const key = datastore.key([TODO, parseInt(tid, 10)]);
    
    const updated_todo = {
        'title': todo.title,
        'content': todo.content,
        'user_id': uid,
        'self': todo.self
    }
    return datastore.save({ 'key': key, 'data': updated_todo });
}

function delete_user(id) {
    const key = datastore.key([USER, parseInt(id, 10)]);
    return datastore.delete(key);
}

router.post('/', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.name && req.body.email) {
            post_user(req.body.name, req.body.email)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "name": req.body.name,
                        "email": req.body.email,
                        "events": [],
                        "todos": [],
                        "notes": [],
                        "self": req.protocol + '://' + req.get('host') + '/user/' + key.id
                    });
                });
        }
        else
            res.status(400).json({ 'Error': 'The request object has missing or incorrect field(s)' });
    }
});

router.get('/:id', (req, res) => {
    get_user(req.params.id)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'No user with this user ID exists' });
            else {
                const accepts = req.accepts([JSON]);
                if (!accepts)
                    res.status(406).json({ 'Error': 'Client must accept application/json' });
                else {
                    res.status(200).json({
                        'id': req.params.id,
                        'name': user[0].name,
                        'email': user[0].email,
                        'events': user[0].events,
                        'todos': user[0].todos,
                        'notes': user[0].notes,
                        'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.id
                    });
                }
            }
        });
});

router.patch('/:uid/calendar/:eid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'No user with that user ID exists' });
            else {
                get_event(req.params.eid)
                    .then(event => {
                        if (event[0] === undefined || event[0] === null)
                            res.status(404).json({ 'Error': 'No event with that event ID exists' });
                        else if (event[0].user_id !== null && event[0].user_id !== undefined)
                            res.status(403).json({ 'Error': 'This event already belongs to a user' });
                        else {
                            patch_user_event(req.params.uid, req.params.eid, user[0], event[0]);
                            res.status(200).json({
                                'id': req.params.uid,
                                'events': user[0].events,
                                'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.uid
                            });
                        }
                    });
            }
        });
});

router.patch('/:uid/note/:nid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'No user with that user ID exists' });
            else {
                get_note(req.params.nid)
                    .then(note => {
                        if (note[0] === undefined || note[0] === null)
                            res.status(404).json({ 'Error': 'Note with that Note ID does not exist' });
                        else if (note[0].user_id !== null && note[0].user_id !== undefined)
                            res.status(403).json({ 'Error': 'This note already belongs to a user' });
                        else {
                            patch_user_note(req.params.uid, req.params.nid, user[0], note[0]);
                            res.status(200).json({
                                'id': req.params.uid,
                                'notes': user[0].notes,
                                'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.uid
                            });
                        }
                    });
            }
        });
});

router.patch('/:uid/todo/:tid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'No user with that user ID exists' });
            else {
                get_todo(req.params.tid) 
                    .then(todo => {
                        if (todo[0] === undefined || todo[0] === null)
                            res.status(404).json({ 'Error': 'Todo with that todo ID does not exist' });
                        else if (todo[0].user_id !== null && todo[0].user_id !== undefined)
                            res.status(403).json({ 'Error': 'This todo already belongs to a user' });
                        else {
                            patch_user_todo(req.params.uid, req.params.tid, user[0], todo[0]);
                            res.status(200).json({
                                'id': req.params.uid,
                                'todos': user[0].todos,
                                'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.uid
                            });
                        }
                    });
            }
        });
});

router.delete('/:id', (req, res) => {
    get_user(req.params.id)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'User with this user ID does not exist' });
            else {
                delete_user(req.params.id);
                res.status(204).end();
            }
        });
});

module.exports = router;