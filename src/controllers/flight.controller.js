const airlineModel = require("../models/airline.Model");
const flightModel = require("../models/flight.Model");
const customError = require("../utils/customError");

module.exports.createFlight = async (req, res, next) => {
  try {
    const {
      flightNumber,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      fare,
      totalSeats,
      status,
    } = req.body;

    if (
      !flightNumber ||
      !from ||
      !to ||
      !date ||
      !departureTime ||
      !fare ||
      !totalSeats
    ) {
      throw new customError("All required fields must be provided", 400);
    }

    const airlineExists = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (!airlineExists) {
      throw new customError("You are not registered as an airline owner", 404);
    }

    const flight = await flightModel.create({
      airlineId: airlineExists._id,
      flightNumber,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      fare,
      totalSeats,
      seatsAvailable: totalSeats,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Flight created successfully",
      data: flight,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new customError("Flight number already exists", 409));
    }
    next(error);
  }
};

module.exports.updateFlight = async (req, res, next) => {
  try {
    const { flightId } = req.params;

    const airlineExists = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (!airlineExists) {
      throw new customError("You are not registered as an airline owner", 404);
    }

    const flight = await flightModel.findOne({
      _id: flightId,
      airlineId: airlineExists._id,
    });

    if (!flight) {
      throw new customError("Flight not found or Access Denied", 404);
    }

    Object.assign(flight, req.body);
    await flight.save();

    res.status(200).json({
      success: true,
      message: "Flight updated successfully",
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteFlight = async (req, res, next) => {
  try {
    const { flightId } = req.params;

    const airlineExists = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (!airlineExists) {
      throw new customError("You are not registered as an airline owner", 404);
    }

    const flight = await flightModel.findOneAndDelete({
      _id: flightId,
      airlineId: airlineExists._id,
    });

    if (!flight) {
      throw new customError("Flight not found or Access Denied", 404);
    }

    res.status(200).json({
      success: true,
      message: "Flight deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getFlights = async (req, res, next) => {
  try {
    const airlineExists = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (!airlineExists) {
      throw new customError("You are not registered as an airline owner", 404);
    }

    const flights = await flightModel.find({
      airlineId: airlineExists._id,
    });

    res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getPublicFlights = async (req, res, next) => {
  try {
    const flights = await flightModel
      .find({ status: "scheduled" })
      .populate("airlineId", "airlineName iataCode");

    res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};
