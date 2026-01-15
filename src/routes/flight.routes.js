const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flight.controller");
const airlineOwnerMiddleware = require("../middlewares/airlineMiddleware");

router.post(
  "/create-flight",
  airlineOwnerMiddleware,
  flightController.createFlight
);

module.exports = router;
