const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

require('dotenv').config({ path: '../.env' });
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const Token = require('../models/Token.js');

router.get('/callback', async (req, res) => {
    // NOTE: This is from the Spotify web docs
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect(
            '/#' +
                querystring.stringify({
                    error: 'state_mismatch',
                })
        );
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    new Buffer.from(client_id + ':' + client_secret).toString(
                        'base64'
                    ),
            },
            json: true,
        };
    }

    // NOTE: This is from stack overflow... somewhere
    const token_url = 'https://accounts.spotify.com/api/token';

    const data = {
        grant_type: 'client_credentials',
    };

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const auth = {
        username: client_id,
        password: client_secret,
    };

    // We're taking multiple responses here so make it mutable
    var response = await axios.post(token_url, data, { headers, auth });
    const accessToken = response.data.access_token;

    // NOTE: access token should not be included in log to console except for testing!
    console.log('[server]: Access token received from Spotify,', accessToken);

    var response = await axios;

    // TODO: To save the access token with a unique identifier, we're hitting the Spotify api again
    // for the current user's user id before storing it all.
    // Also store the user id as a cookie to query Mongo with it?
    //
    // WARN: This endpoint is down and will throw an invalid token error.
    // Using a hardcoded user_id in its place
    var response = await axios
        .get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response) => {
            //const user_id = response.data.id;
            //console.log('[server]: Request for user info was fulfilled');
            //console.log(user_id);
        })
        .catch((error) => {
            console.error('[error]:', error.message);
        });

    // TODO: Handle redirecting to '/' (or '/playlist'?) route after receiving token
    console.log('[server]: Redirecting user away from callback route');
    res.redirect('/');
});

module.exports = router;
