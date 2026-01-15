const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema(
  {
    airlineName: {
      type: String,
      required: true,
      unique: true,
    },
    iataCode: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 3,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("airline", airlineSchema);
