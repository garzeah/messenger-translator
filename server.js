const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");

// require("./models/User");
// const User = mongoose.model("users");

// Connecting to remote Mongo database
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Testing to see if our information persists to our DB
// new User({
//   name: "Andy Garcia",
//   email: "acgarzeah@gmail.com",
//   password: "password",
// }).save();

app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
