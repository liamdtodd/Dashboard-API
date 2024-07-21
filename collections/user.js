const express = require('express');
const bodyParser = require('body-parser');
const ds = require('../datastore/datastore');
const datastore = ds.datastore;
const router = express.Router();

const USER = 'USER';
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