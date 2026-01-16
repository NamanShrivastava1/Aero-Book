const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/booking.controller");

router.post(
  "/create-booking",
  authMiddleware.authMiddleware,
  bookingController.createBooking
);

module.exports = router;
