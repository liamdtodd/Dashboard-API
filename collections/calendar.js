const express = require('express');
const bodyParser = require('body-parser');
const ds = require('../datastore/datastore');
const datastore = ds.datastore;
const router = express.Router();

const EVENT = 'Event';

router.use(bodyParser.json());

function post_event(name, date, uid) {
    var key = datastore.key(EVENT);
    const self_url = 'http://localhost:8080/calendar/' + key.id;
    const data = {
        "name": name,
        "date": date,
        "user_id": uid,
        "self": self_url
    }

    return datastore.save({
        "key": key,
        "data": data
    }).then(() => { return key });
}

router.post('/', (req, res) => {
    if (req.get('content-type') !== 'application/json')
        res.status(415).json({ 'Error': 'Server only accepts application/json data' });
    else {
        if (req.body.name && req.body.date && req.body.uid) {
            post_event(req.body.name, req.body.date, req.body.uid)
                .then(key => {
                    res.status(201).json({
                        "id": key.id,
                        "name": req.body.name,
                        "date": req.body.date,
                        "uid": req.body.uid,
                        "self": req.protocol + '://' + req.get('host') + '/calendar' + key.id
                    });
                });
        }
        else
            res.status(400).json({ 'Error': 'The request object has missing or incorrect field(s)' });
    }
});

module.exports = router;