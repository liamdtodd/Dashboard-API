const express = require('express');
const bodyParser = require('body-parser');
const ds = require('../datastore/datastore');
const datastore = ds.datastore;
const router = express.Router();

const NOTE = 'NOTE';
const JSON = 'application/json';

router.use(bodyParser.json());

function post_note(title, content, uid) {
    var key = datastore.key(NOTE);
    const self_url = 'http://localhost:8080/note/' + key.id;
    const data = {
        "title": title,
        "content": content,
        "user_id": uid,
        "self": self_url
    }

    return datastore.save({
        "key": key,
        "data": data
    }).then(() => { return key });
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

function delete_note(id) {
    const key = datastore.key([NOTE, parseInt(id, 10)]);
    return datastore.delete(key);
}

router.post('/', (req, res) => {
    if (req.get('content-type') !== JSON)
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.title && req.body.content && req.body.user_id) {
            post_note(req.body.title, req.body.content, req.body.user_id)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "title": req.body.title,
                        "content": req.body.content,
                        "user_id": req.body.user_id,
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