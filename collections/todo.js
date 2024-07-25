const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { get_todo } = require('../methods/get');
const { post_todo } = require('../methods/post');
const { delete_todo } = require('../methods/delete');
const { put_todo } = require('../methods/put');
const { patch_todo_name, patch_todo_content } = require('../methods/patch');

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

router.patch('/:id', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        get_todo(req.params.id)
            .then(todo => {
                if (todo[0] === undefined || todo[0] === null)
                    res.status(404).json({ 'Error': 'The todo with this todo ID does not exist' });
                else {
                    if (req.body.name) {
                        patch_todo_name(req.params.id, todo[0], req.body.name);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': req.body.name,
                            'content': todo[0].content,
                            'user_id': todo[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/todo/' + req.params.id
                        });
                    } else if (req.body.content) {
                        patch_todo_content(req.params.id, todo[0], req.body.content);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': todo[0].name,
                            'content': req.body.content,
                            'user_id': todo[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/todo/' + req.params.id
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
        get_todo(req.params.id)
            .then(todo => {
                if (todo[0] === undefined || todo[0] === null)
                    res.status(404).json({ 'Error': 'No todo with that todo ID exists' });
                else {
                    if (req.body.name && req.body.content) {
                        put_todo(req.params.id, todo[0], req.body.name, req.body.content);
                        res.status(200).json({
                            'id': req.params.id,
                            'name': req.body.name,
                            'content': req.body.content,
                            'self': req.protocol + '://' + req.get('host') + '/todo/' + req.params.id
                        });
                    }
                    else
                        res.status(400).json({ 'Error': 'Missing or incomplete field(s) in request body' });
                }
            });
    }
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