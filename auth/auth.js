const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');
var { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const DOMAIN = 'dev-k4eada1shnbn14a6.us.auth0.com';
const CLIENT_ID = 'oFOh5R7lpQsijvT8SbnLLI06rc2KCjze';
const { CLIENT_SECRET } = require('../client_secret');

module.exports.checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-k4eada1shnbn14a6.us.auth0.com/.well-known/jwks.json'
    }),

    issuer: 'https://dev-k4eada1shnbn14a6.us.auth0.com/',
    algorithms: ['RS256']
});

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
    //TODO: configure this route for creating users
    res.send(JSON.stringify(req.oidc.user));
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

    request(options, (err, res, body) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(body);
    });
});

module.exports = router;