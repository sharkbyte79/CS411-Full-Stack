const express = require('express');
const cors = require('cors');
const app = express();

// Fetch preferred port, Spotify and Mongo keys, etc.
require('dotenv').config();
const port = process.env.PORT || 3000; // Use preferred port or default to 3000
const mongodb_uri = process.env.MONGODB_URI;

// Include routes
const login = require('./routes/login');
const cover = require('./routes/cover');
const playlist = require('./routes/playlist');
const callback = require('./routes/callback');

// TODO: MORE ROUTES HERE

// NOTE: Mozilla web docs and tutorials show these in the following format,
//  const someRoute = require("./routes/someRoute");
//  ...
//  app.use("/someRoute", someRoute);
// But including the intended name of the route for the first parameter, as per my testing,
// makes Express unable to find it!
const routers = [login, callback, cover, playlist];
routers.forEach((router) => app.use('/', router));

const mongoose = require('mongoose');
mongoose
    .connect(mongodb_uri, {
        // Mongo throws warnings in the console for these; just ignore it
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('[server]: Connected to MongoDB'))
    .catch((err) =>
        console.error('[server]: Could not connect to MongoDB:', err)
    );

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running at http://localhost:${port}`);
});
