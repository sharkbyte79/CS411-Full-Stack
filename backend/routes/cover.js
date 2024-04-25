const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const Cover = require('../models/Cover');

const router = express.Router();

require('dotenv').config({ path: '../.env' });
const cat_api_key = process.env.CAT_API_KEY;

router.get('/cover', async (req, res) => {
    try {
        // Get a single image from TheCatApi.
        // The api supports fetching an array of JSON objects with multiple entries, but for a single playlist we only need one.
        var response; // response may need to be reassigned if its url field points to a gif, so let it be mutable
        let isGIF = true;

        while (isGIF) {
            response = await axios.get(
                'https://api.thecatapi.com/v1/images/search?' +
                    querystring.stringify({
                        api_key: cat_api_key,
                        has_breeds: 0, // set to 1 to only return entries with breed info
                    })
            );
            urlParts = response.data[0].url.split('.');
            fileExt = urlParts[3];
            console.log(
                '[server]: Response contained url with extension',
                fileExt
            );
            // Stop making requests if the return is a jpg or png
            if (fileExt != 'gif') {
                isGIF = false;
            } else {
                console.log('[server]: Response with gif was rejected');
            }
        }
        // console.log('[server]: Response from TheCatAPI was:\n',response.data[0]);
        res.send(response.data[0]); // NOTE: Right now we're just displaying the response
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
