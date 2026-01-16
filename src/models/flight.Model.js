const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    airlineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "airline",
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: String, // DD/MM/YYYY
      required: true,
    },
    departureTime: {
      type: String, // HH:MM
      required: true,
    },
    arrivalTime: {
      type: String, // HH:MM
    },
    fare: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "departed", "cancelled", "delayed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("flight", flightSchema);
