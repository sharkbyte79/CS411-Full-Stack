const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const Token = require('../models/Token');
const Cover = require('../models/Cover');

const router = express.Router();

router.get('/playlist', async (req, res) => {
    try {
        const { user_id } = req.query; // Retrieve the user_id
        
        // Retrieve the access token from the database
        const token = await Token.findOne();

        // Make a POST request to generate the empty playlist
        const playlistResponse = await axios.post(
            `https://api.spotify.com/v1/users/${user_id}/playlists`,
            {
                name: 'Your Playlist Name',
                description: 'Your Playlist Description',
                public: false,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`, // Include the access token in the headers
                    'Content-Type': 'application/json',
                }
            }
        );

        // Save the playlist to MongoDB
        const playlist = new Playlist({ playlist: playlistResponse.data });
        await playlist.save();

        res.status(200).json({ playlist: playlistResponse.data });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


router.get('/save-playlist', async (req, res) => {
    try {
        // Implement saving the playlist here
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
