const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const Token = require('../models/Token');
const Cover = require('../models/Cover');

const router = express.Router();

router.get('/playlist', async (req, res) => {
    try {
        // Since we're not prepping for many users, just assume there's one relevant entry for each 
        // type in the database. 
        // Ideally we would fetch it from the database via some safe, unique identifier per each entry.
        const token = await Token.findOne();
        const cover = await Cover.findOne();

        // tODO: Make a post request to generate the empty playlist


    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get('/save-playlist', async (req, res) => {
    try {
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
