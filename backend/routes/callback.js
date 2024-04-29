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
        try {
            const auth = await axios.post('https://accounts.spotify.com/api/token', {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
                }
            });

            const data = auth.data;
            const access_token = data.access_token;
            const refresh_token = data.refresh_token;

            const userInfo = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                json: true
            });

            const user = userInfo.data;
            const user_id = user.id;

            console.log('[server]: Access token received from Spotify')

            const token = new Token({ user_id, access_token });
            await token.save();
            console.log("[server]: Access token and user ID saved to database");

            console.log('[server]: Redirecting user away from callback route');
            res.redirect(
                'http://localhost:4000/?' +
                querystring.stringify({
                    user_id: user_id
                })
            );;
            // Proceed with the obtained access token and refresh token
        } catch (error) {
            console.error('Error:', error.response.data);
        }
    }
});

module.exports = router;
