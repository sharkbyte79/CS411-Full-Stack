const express = require('express');
const axios = require('axios');
const Cover = require('../models/Cover');

const router = express.Router();

router.get('/cover', async (req, res) => {
    try {
        // Get a single image from TheCatApi.
        // The api supports fetching an array of JSON objects with multiple entries,
        // but for a single playlist we only need one.
        const response = await axios.get(
            'https://api.thecatapi.com/v1/images/search'
        );

        console.log(
            '[server]: Response from TheCatAPI was:\n',
            response.data[0]
        );
        res.send(response.data[0]);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post('/save-cover', async (req, res) => {
    try {
        // TODO: This doesn't quite work yet.
        const { id, url } = req.body;
        const ok = await Cover.findOne({ id });

        if (ok) {
            return res.status(409).send('Image ID already exists.');
        }

        const cover = new Cover({ id, url });
        await cover.save();

        console.log('[server]: New cover was saved to the database!');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
