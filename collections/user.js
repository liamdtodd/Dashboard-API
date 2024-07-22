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
    patch_event(uid, eid);
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

function patch_event(uid, eid) {
    const key = datastore.key([EVENT, parseInt(eid, 10)]);
    const event_url = 'http://localhost:8080/event/' + key.id;
    const event = {
        'user_id': uid,
        'self': event_url
    }
    return datastore.save({ 'key': key, 'data': event })
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
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
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
                                    'events': event[0],
                                    'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.uid
                                });
                            }
                        });
                }
            });
    }
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