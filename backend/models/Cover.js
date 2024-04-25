const mongoose = require('mongoose');

const coverSchema = new mongoose.Schema({
    // The Cat API returns a JSON array that contains the following fields:
    id: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    width: {
        type: Number,
        required: false,
        unique: false,
    },
    height: {
        type: Number,
        required: false,
        unique: false,
    },
});

const Cover = mongoose.model('Cover', coverSchema);

module.exports = Cover;
