const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    // NOTE: Spotify api returns playlists in the form of a
    // JSON object, but breaking that object up for the schema
    // may be preferable.
    playlist: { type: Object, required: true, unique: true },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
