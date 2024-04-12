const mongoose = require("mongoose");

const coverScheme = new mongoose.Schema({
  id: { type: string, required: true, unique: true },
  url: { type: string, required: true, unique: true },
  width: { type: number, required: false, unique: false },
  height: { type: number, required: false, unique: false },
});

const Cover = mongoose.model("Cover", coverScheme);

module.exports = Cover;
