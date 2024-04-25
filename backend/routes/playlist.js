const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');

const router = express.Router();

router.get('/playlist', async (req, res) => {
    try {
        const access_token = await Token.find();
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
