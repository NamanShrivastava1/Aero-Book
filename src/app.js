const express = require("express");
const app = express();
const morgan = require("morgan");
const logger = require("./utils/logger");
const { info } = require("winston");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Welcome to the Airline Booking Home Page!");
});

module.exports = app;
