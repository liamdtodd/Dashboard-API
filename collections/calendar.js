const express = require('express');
const bodyParser = require('body-parser');
const ds = require('../datastore/datastore');
const datastore = ds.datastore;
const router = express.Router();

const EVENT = 'EVENT';
const JSON = 'application/json';

router.use(bodyParser.json());

function post_event(name, date) {
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

function get_event(id) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    return datastore.get(key).then((event) => {
        if (event[0] === undefined || event[0] === null) 
            return event;
        else
            return event.map(ds.fromDatastore);
    });
}

function delete_event(id) {
    const key = datastore.key([EVENT, parseInt(id, 10)]);
    return datastore.delete(key);
}

router.post('/', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.name && req.body.date) {
            post_event(req.body.name, req.body.date)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "name": req.body.name,
                        "date": req.body.date,
                        "user_id": null,
                        "self": req.protocol + '://' + req.get('host') + '/calendar/' + key.id
                    });
                });
        }
        else
            res.status(400).json({ 'Error': 'The request object has missing or incorrect field(s)' });
    }
});

router.get('/:id', (req, res) => {
    get_event(req.params.id)
        .then(event => {
            if (event[0] === undefined || event[0] === null)
                res.status(404).json({ 'Error': 'No event with this event ID exists' });
            else {
                const accepts = req.accepts([JSON]);
                if (!accepts)
                    res.status(406).json({ 'Error': 'Client must accept application/json' });
                else {
                    res.status(200).json({
                        'id': req.params.id,
                        'name': event[0].name,
                        'date': event[0].date,
                        'user_id': event[0].user_id,
                        'self': req.protocol + '://' + req.get('host') + '/calendar/' + req.params.id
                    });
                }
            }
        });
});

router.delete('/:id', (req, res) => {
    get_event(req.params.id)
        .then(event => {
            if (event[0] === undefined || event[0] === null)
                res.status(404).json({ 'Error': 'Event with this event ID does not exist' });
            else {
                delete_event(req.params.id);
                res.status(204).end();
            }
        });
});

module.exports = router;