const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { get_note } = require('../methods/get');
const { post_note } = require('../methods/post');
const { delete_note } = require('../methods/delete');
const { put_note } = require('../methods/put');
const { patch_note_title, patch_note_content } = require('../methods/patch');

const JSON = 'application/json';

router.use(bodyParser.json());

router.post('/', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.title && req.body.content) {
            post_note(req.body.title, req.body.content)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "title": req.body.title,
                        "content": req.body.content,
                        "user_id": null,
                        "self": req.protocol + '://' + req.get('host') + '/note/' + key.id
                    });
                });
        }
        else
            res.status(400).json({ 'Error': 'The request object has missing or incorrect field(s)' });
    }
});

router.get('/:id', (req, res) => {
    get_note(req.params.id)
        .then(note => {
            if (note[0] === undefined || note[0] === null)
                res.status(404).json({ 'Error': 'No note with this note ID exists' });
            else {
                const accepts = req.accepts([JSON]);
                if (!accepts)
                    res.status(406).json({ 'Error': 'Client must accept application/json' });
                else {
                    res.status(200).json({
                        'id': req.params.id,
                        'title': note[0].title,
                        'content': note[0].content,
                        'user_id': note[0].user_id,
                        'self': req.protocol + '://' + req.get('host') + '/note/' + req.params.id
                    });
                }
            }
        });
});

router.patch('/:id', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        get_note(req.params.id)
            .then(note => {
                if (note[0] === undefined || note[0] === null)
                    res.status(404).json({ 'Error': 'The note with this note ID does not exist' });
                else {
                    if (req.body.title) {
                        patch_note_title(req.params.id, note[0], req.body.title);
                        res.status(200).json({
                            'id': req.params.id,
                            'title': req.body.title,
                            'content': note[0].content,
                            'user_id': note[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/note/' + req.params.id
                        });
                    } else if (req.body.content) {
                        patch_note_content(req.params.id, note[0], req.body.content);
                        res.status(200).json({
                            'id': req.params.id,
                            'title': note[0].title,
                            'content': req.body.content,
                            'user_id': note[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/note/' + req.params.id
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
        get_note(req.params.id)
            .then(note => {
                if (note[0] === undefined || note[0] === null)
                    res.status(404).json({ 'Error': 'No note wit this note ID exists' });
                else {
                    if (req.body.title && req.body.content) {
                        put_note(req.params.id, note[0], req.body.title, req.body.content)
                        res.status(200).json({
                            'id': req.params.id,
                            'title': req.body.title,
                            'content': req.body.content,
                            'user_id': note[0].user_id,
                            'self': req.protocol + '://' + req.get('host') + '/note/' + req.params.id
                        });
                    }
                    else
                        res.status(400).json({ 'Error': 'Missing or incomplete field(s) in request body' });
                }
            })
    }
})

router.delete('/:id', (req, res) => {
    get_note(req.params.id)
        .then(note => {
            if (note[0] === undefined || note[0] === null)
                res.status(404).json({ 'Error': 'Note with this note ID does not exist' });
            else {
                delete_note(req.params.id);
                res.status(204).end();
            }
        });
});

module.exports = router;