const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

require('dotenv').config({ path: '../.env' });
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const Token = require('../models/Token.js');

router.get('/callback', async (req, res) => {
    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: client_id,
            password: client_secret,
        },
    };

    const data = {
        grant_type: 'client_credentials',
    };

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify(data),
            headers
        );

        console.log('[server]: Access token received from Spotify');
        let access_token = response.data.access_token;
        const token = new Token({ access_token });
        await token.save();
    } catch (error) {
        res.status(500).send(error.toString());
    }
    // TODO: Handle redirecting to '/' (or '/playlist'?) route after receiving token
});

module.exports = router;
