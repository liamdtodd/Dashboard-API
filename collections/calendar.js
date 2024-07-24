const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { get_event } = require('../methods/get');
const { post_event } = require('../methods/post');
const { delete_event } = require('../methods/delete');
const { put_event } = require('../methods/put');

const JSON = 'application/json';

router.use(bodyParser.json());

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

router.put('/:id', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(200).json({ 'Error': 'Server only accepts application/json data' });
    else {
        get_event(req.params.id)
            .then(event => {
                if (event[0] === undefined || event[0] === null)
                    res.status(404).json({ 'Error': 'No event with this event ID exists' });
                else {
                    if (req.body.name && req.body.date) {
                        put_event(req.params.id, event[0], req.body.name, req.body.date);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': req.body.name,
                            'date': req.body.date,
                            'user_id': event[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/calendar/' + req.params.id
                        });
                    }
                    else
                        res.status(400).json({ 'Error': 'Missing or incomplete field(s) in request body' });
                }
            });
    }
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