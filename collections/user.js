const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { get_event, get_note, get_todo, get_user } = require('../methods/get');
const { post_user } = require('../methods/post');
const { delete_user } = require('../methods/delete');
const { patch_user_event, patch_user_note, patch_user_todo } = require('../methods/user/patch');
const { delete_user_event, delete_user_note, delete_user_todo } = require('../methods/user/delete');
const { put_user } = require('../methods/put');
const { patch_user_name, patch_user_email } = require('../methods/patch');

const JSON = 'application/json';

router.use(bodyParser.json());

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

router.patch('/:id', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        get_user(req.params.id)
            .then(user => {
                if (user[0] === undefined || user[0] === null)
                    res.status(404).json({ 'Error': 'The user with this user ID does not exist' });
                else {
                    if (req.body.name) {
                        patch_user_name(req.params.id, user[0], req.body.name);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': req.body.name,
                            'email': user[0].email,
                            'events': user[0].events,
                            'notes': user[0].notes,
                            'todos': user[0].todos,
                            'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.id
                        });
                    } else if (req.body.email) {
                        patch_user_email(req.params.id, user[0], req.body.email);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': user[0].name,
                            'email': req.body.email,
                            'events': user[0].events,
                            'notes': user[0].notes,
                            'todos': user[0].todos,
                            'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.id
                        });
                    } else
                        res.status(400).json({ 'Error': 'Invalid field in the request body' });
                }
            });
    }
});

router.put('/:id', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        get_user(req.params.id)
            .then(user => {
                if (user[0] === undefined || user[0] === null)
                    res.status(404).json({ 'Error': 'No user with this user ID exists' });
                else {
                    if (req.body.name && req.body.email) {
                        put_user(req.params.id, user[0], req.body.name, req.body.email)
                        res.status(200).json({
                            'id': req.params.id,
                            'name': req.body.name,
                            'email': req.body.email,
                            'events': user[0].events,
                            'notes': user[0].notes,
                            'todos': user[0].todos,
                            'self': req.protocol + '://' + req.get('host') + '/user/' + req.params.id
                        });
                    }
                    else
                        res.status(400).json({ 'Error': 'Missing or incomplete field(s) in request body' });
                }
            });
    }
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

router.delete('/:uid/calendar/:eid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'User with this user ID does not exist' });
            else if (user[0].events == [])
                res.status(403).json({ 'Error': 'User does not have any events to delete' });
            else {
                get_event(req.params.eid)
                    .then(event => {
                        if (event[0] === undefined || event[0] === null)
                            res.status(404).json({ 'Error': 'Event with this event ID does not exist' });
                        else if (event[0].user_id != req.params.uid)
                            res.status(403).json({ 'Error': 'Event does not belong to this user' });
                        else {
                            delete_user_event(req.params.uid, req.params.eid, user[0]);
                            res.status(204).end();
                        }
                    });
            }
        });
});

router.delete('/:uid/note/:nid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'User with this user ID does not exist' });
            else if (user[0].notes == [])
                res.status(403).json({ 'Error': 'User does not have any notes to delete' });
            else {
                get_note(req.params.nid)
                    .then(note => {
                        if (note[0] === undefined || note[0] === null)
                            res.status(404).json({ 'Error': 'Note with this note ID does not exist' });
                        else if (note[0].user_id != req.params.uid)
                            res.status(403).json({ 'Error': 'Note does not belong to this user' });
                        else {
                            delete_user_note(req.params.uid, req.params.nid, user[0]);
                            res.status(204).end();
                        }
                    });
            }
        });
});

router.delete('/:uid/todo/:tid', (req, res) => {
    get_user(req.params.uid)
        .then(user => {
            if (user[0] === undefined || user[0] === null)
                res.status(404).json({ 'Error': 'User with this user ID does not exist' });
            else if (user[0].todos == [])
                res.status(403).json({ 'Error': 'User does not have any todos to delete' });
            else {
                get_todo(req.params.tid)
                    .then(todo => {
                        if (todo[0] === undefined || todo[0] === null)
                            res.status(404).json({ 'Error': 'Todo with this todo ID does not exist' });
                        else if (todo[0].user_id != req.params.uid)
                            res.status(403).json({ 'Error': 'Todo does not belong to this user' });
                        else {
                            delete_user_todo(req.params.uid, req.params.tid, user[0]);
                            res.status(204).end();
                        }
                    });
            }
        });
});

module.exports = router;