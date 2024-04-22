const express = require("express");
const axios = require("axios");
const Playlist = require("../models/Playlist");

const router = express.Router();

router.get("/playlist", async (req, res) => {
    try {
        // NOTE: Not sure how to handle using the access token acquired during
        // auth, need to figure this out before we can make the playlist.


    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post("/save-playlist", async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error.toString());
    }
})

module.exports = router;