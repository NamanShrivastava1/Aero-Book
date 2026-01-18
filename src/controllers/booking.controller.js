const bookingModel = require("../models/booking.Model");
const flightModel = require("../models/flight.Model");
const seatLockService = require("../services/seatLock.service");
const customError = require("../utils/customError");

module.exports.createBooking = async (req, res, next) => {
  try {
    const { flightId, seatNumbers } = req.body;

    if (!flightId || !seatNumbers?.length) {
      throw new customError("flightId and seatNumbers are required", 400);
    }

    const flight = await flightModel.findById(flightId);
    if (!flight) {
      throw new customError("Flight not found", 404);
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

module.exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingModel
      .find({ userId: req.user._id })
      .populate("flightId")
      .populate("airlineId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      throw new customError("Unauthorized to cancel this booking", 403);
    }

    if (booking.status === "Cancelled") {
      throw new customError("Booking is already cancelled", 400);
    }

    booking.status = "Cancelled";
    await booking.save();

    await seatLockService.releaseSeats(booking.flightId, booking.seatsBooked);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getBookingsForAirline = async (req, res, next) => {
  try {
    const bookings = await bookingModel
      .find({ airlineId: req.airline._id })
      .populate("flightId")
      .populate("userId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
