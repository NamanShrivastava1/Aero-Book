const customError = require("../utils/customError");

module.exports.createFlight = async (req, res, next) => {
  try {
    const {
      airlineId,
      flightNumber,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      fare,
      totalSeats,
      seatsAvailable,
      status,
    } = req.body;

    if (
      !airlineId ||
      !flightNumber ||
      !from ||
      !to ||
      !date ||
      !departureTime ||
      !fare ||
      !totalSeats ||
      !seatsAvailable
    ) {
      throw new customError("All required fields must be provided", 400);
    }

    const flight = await flightModel.create({
      airlineId,
      flightNumber,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      fare,
      totalSeats,
      seatsAvailable,
      status,
    });

    

    res.status(201).json({
      success: true,
      message: "Flight created successfully",
    });
  } catch (error) {
    throw new customError("Flight creation failed", 500);
  }
};
