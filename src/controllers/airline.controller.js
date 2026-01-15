const airlineModel = require("../models/airline.Model");
const customError = require("../utils/customError");

module.exports.createAirline = async (req, res, next) => {
  try {
    const { airlineName, iataCode } = req.body;

    if (!airlineName || !iataCode) {
      throw new customError("Airline name and IATA code are required", 400);
    }

    const ownerAlreadyHasAirline = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (ownerAlreadyHasAirline) {
      throw new customError("You already own an airline", 409);
    }

    const existingAirline = await airlineModel.findOne({
      $or: [{ airlineName }, { iataCode }],
    });

    if (existingAirline) {
      throw new customError(
        "Airline with the same name or IATA code already exists",
        409
      );
    }

    const newAirline = await airlineModel.create({
      airlineName,
      iataCode,
      ownerUserId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Airline created successfully",
      airline: newAirline,
    });
  } catch (err) {
    throw new customError(err.message, err.status || 500);
  }
};

module.exports.getMyAirline = async (req, res, next) => {
  try {
    const airline = await airlineModel.findOne({
      ownerUserId: req.user._id,
    });

    if (!airline) {
      return res.status(200).json({
        success: true,
        airline: null,
        message: "No airline created yet",
      });
    }

    res.status(200).json({
      success: true,
      airline,
    });
  } catch (err) {
    throw new customError(err.message, err.status || 500);
  }
};
