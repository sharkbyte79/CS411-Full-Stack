const express = require("express");
const cors = require("cors");
//const routes = require('./routes');

const app = express();
app.use(cors());

// Fetch preferred port, Spotify and Mongo keys, etc.
require("dotenv").config();
const port = process.env.PORT || 3000; // Use preferred port or default to 3000

// Include routes
const loginRoute = require("./routes/login");
const makePlaylistRoute = require("./routes/make_playlist");
// TODO: MORE ROUTES HERE

// const mongoose = require("mongoose")
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use(express.json());
app.use("/", loginRoute);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
