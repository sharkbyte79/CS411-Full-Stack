const express = require('express');
const querystring = require('querystring');
const router = express.Router();
//const axios = require("axios");

require('dotenv').config({ path: '../.env' });
const redirect_uri = process.env.REDIRECT_URI;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

/**
 * Returns a "random" string of some length.
 *
 * @remarks
 * The returned string isn't purported to be cryptographically secure.
 *
 * @param length - the length of the output string.
 * @returns string of param length many characters.
 */
const generateRandomString = (length) => {
    let s = '';
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
};
// TODO: Replace this with a cryptographically secure implementation? Probably not necessary for our use case, but would be better practice.

router.get('/login', (req, res) => {
    var scope =
        'user-read-private user-read-email playlist-modify-public playlist-modify-private ugc-image-upload';

    // Redirect the user to Spotify for login/authentification
    res.redirect(
        'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: generateRandomString(16),
                show_dialog: true, // Always ask for permission to authorize (testing purposes)
            })
    );
});

router.get('/callback', (req, res) => {
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
});

// NOTE: This is untested as of the time of writing (12 April 2024), making sure it works
// will require waiting an hour for the user's authorization token to expire.
router.get('/refresh_token', (req, res) => {
    console.log(`[server]: request to refresh authorization token`);

    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' +
                new Buffer.from(client_id + ':' + client_secret).toString(
                    'base64'
                ),
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        },
        json: true,
    };

    axios.post(authOptions, (err, response, body) => {
        if (!err && res.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            res.send({
                access_token: access_token,
                refresh_token: refresh_token,
            });
        }
    });
});

module.exports = router;
