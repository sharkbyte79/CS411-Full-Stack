const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    access_token: { type: String, required: true, unique: false },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
