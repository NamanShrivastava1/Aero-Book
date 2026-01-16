const bookingModel = require("../models/booking.Model");
const flightModel = require("../models/flight.Model");
const seatLockService = require("../services/seatLock.service");

module.exports.createBooking = async (req, res, next) => {
  try {
    const { flightId, seatNumbers } = req.body;

    if (!flightId || !seatNumbers?.length) {
      return res.status(400).json({
        success: false,
        message: "flightId and seatNumber are required",
      });
    }

    const flight = await flightModel.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      });
    }

    await seatLockService.lockSeats({
      flightId,
      userId: req.user._id,
      seatNumbers,
    });

    if (flight.seatsAvailable < seatNumbers.length) {
      throw new customError("Not enough available seats", 400);
    }

    const totalAmount = seatNumbers.length * flight.fare;

    const booking = await bookingModel.create({
      flightId: flight._id,
      userId: req.user._id,
      airlineId: flight.airlineId,
      seatsBooked: seatNumbers.length,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Seat locked, Complete your payment to confirm booking",
      booking,
      seats: seatNumbers,
      lockExpiresIn: "10 Minutes",
    });
  } catch (error) {
    next(error);
  }
};
