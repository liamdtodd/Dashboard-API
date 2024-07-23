const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { get_todo } = require('../methods/get');
const { post_todo } = require('../methods/post');
const { delete_todo } = require('../methods/delete');

const JSON = 'application/json';

router.use(bodyParser.json());

router.post('/', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.name && req.body.content) {
            post_todo(req.body.name, req.body.content)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "name": req.body.name,
                        "content": req.body.content,
                        "user_id": null,
                        "self": req.protocol + '://' + req.get('host') + '/todo/' + key.id
                    });
                });
        }
        else
            res.status(400).json({ 'Error': 'The request object has missing or incorrect field(s)' });
    }
});

router.get('/:id', (req, res) => {
    get_todo(req.params.id)
        .then(todo => {
            if (todo[0] === undefined || todo[0] === null)
                res.status(404).json({ 'Error': 'No todo with this todo ID exists' });
            else {
                const accepts = req.accepts([JSON]);
                if (!accepts)
                    res.status(406).json({ 'Error': 'Client must accept application/json' });
                else {
                    res.status(200).json({
                        'id': req.params.id,
                        'name': todo[0].name,
                        'content': todo[0].content,
                        'user_id': todo[0].user_id,
                        'self': req.protocol + '://' + req.get('host') + '/todo/' + req.params.id
                    });
                }
            }
        });
});

router.delete('/:id', (req, res) => {
    get_todo(req.params.id)
        .then(todo => {
            if (todo[0] === undefined || todo[0] === null)
                res.status(404).json({ 'Error': 'Todo with this todo ID does not exist' });
            else {
                delete_todo(req.params.id);
                res.status(204).end();
            }
        });
});

module.exports = router;