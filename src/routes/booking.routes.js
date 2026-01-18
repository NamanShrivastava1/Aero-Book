const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const airlineMiddleware = require("../middlewares/airlineMiddleware");
const bookingController = require("../controllers/booking.controller");

router.post(
  "/create-booking",
  authMiddleware.authMiddleware,
  bookingController.createBooking
);

router.get(
  "/get-bookings",
  authMiddleware.authMiddleware,
  bookingController.getBookings
);

router.post(
  "/:bookingId/cancel",
  authMiddleware.authMiddleware,
  bookingController.cancelBooking
);

// For Airline Owners to see bookings for their airline
router.get(
  "/airline",
  airlineMiddleware,
  bookingController.getBookingsForAirline
);

module.exports = router;
