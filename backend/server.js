const express = require("express");
//const cors = require("cors");

const app = express();

// Fetch preferred port, Spotify and Mongo keys, etc.
require("dotenv").config();
const port = process.env.PORT || 3000; // Use preferred port or default to 3000
const mongodb_uri = process.env.MONGODB_URI;


// Include routes
const login = require("./routes/login");
const cover = require("./routes/cover");
// TODO: MORE ROUTES HERE

app.use("/", login);
app.use("/", cover)

const mongoose = require("mongoose");
mongoose
  .connect(mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[server]: Connected to MongoDB"))
  .catch((err) => console.error("[server]: Could not connect to MongoDB:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});
