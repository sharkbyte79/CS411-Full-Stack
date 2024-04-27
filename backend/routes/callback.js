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

    var response = await axios.post(token_url, data, { headers, auth });
    const access_token = response.data.access_token;

    // WARN: The endpoint that would retrieve a user id is down and will throw an invalid token error.
    // Using a hardcoded user id in its place.
    const user_id = "31li3ybokyk2lhumdqredasoyv7q"; 
    console.log('[server]: Access token received from Spotify')

    const token = new Token({user_id, access_token});
    await token.save();
    console.log("[server]: Access token and user ID saved to database");

    // TODO: Handle redirecting to '/' (or '/playlist'?) route after receiving token
    console.log('[server]: Redirecting user away from callback route');
    res.redirect('/');
});

module.exports = router;
