const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flight.controller");
const airlineOwnerMiddleware = require("../middlewares/airlineMiddleware");

router.post(
  "/create-flight",
  airlineOwnerMiddleware,
  flightController.createFlight
);

router.patch(
  "/update-flight/:flightId",
  airlineOwnerMiddleware,
  flightController.updateFlight
);

router.delete(
  "/delete-flight/:flightId",
  airlineOwnerMiddleware,
  flightController.deleteFlight
);

// Get Flights Airline Owner
router.get("/get-flights", airlineOwnerMiddleware, flightController.getFlights);

// Get Flights Public
router.get("/public-flights", flightController.getPublicFlights);

module.exports = router;
