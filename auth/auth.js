const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');

const DOMAIN = 'dev-k4eada1shnbn14a6.us.auth0.com';
const CLIENT_ID = 'oFOh5R7lpQsijvT8SbnLLI06rc2KCjze';
const { CLIENT_SECRET } = require('../client_secret');
const { get_users, create_user } = require('../methods/get');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: '5c5aa565fea976807ddb5827e7c57ca344830b1852ba2310c10ef4540c5a7d46',
    baseURL: 'http://localhost:8080',
    clientID: 'oFOh5R7lpQsijvT8SbnLLI06rc2KCjze',
    issuerBaseURL: 'https://dev-k4eada1shnbn14a6.us.auth0.com'
}

router.use(bodyParser.json());
router.use(auth(config));

router.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

router.get('/profile', requiresAuth(), (req, res) => {
    let unique = true;
    const users = get_users()
        .then((users) => {
            for (var x = 0; x < users.length; x++) {
                if (users[x].sub == req.oidc.user.sub)
                    unique = false;
            }

            if (unique === true) {
                create_user(req.oidc.user);
                res.status(201).json({
                    'JWT': req.oidc.idToken,
                    'sub': req.oidc.user.sub
                });
            } else
                res.status(200).json({
                    'JWT': req.oidc.idToken,
                    'sub': req.oidc.user.sub
                });
        });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    var options = {
        method: 'POST',
        url: `https://${DOMAIN}/oauth/token`,
        headers: {
            'content-type': 'application/json'
        },
        body: {
            grant_type: 'password',
            username: username,
            password: password,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        },
        json: true
    };

    request(options, (err, response, body) => {
        if (err) {
            res.status(500).send(err);
        }else {
            res.send(body);
        }
    });
});

module.exports = router;