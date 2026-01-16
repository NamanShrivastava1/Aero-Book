const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { info } = require("winston");

const logger = require("./utils/logger");
const cacheClient = require("./services/cache.service");
const errorHandler = require("./middlewares/errorHandlers");

const userRoutes = require("./routes/user.routes");
const airlineRoutes = require("./routes/airline.routes");
const flightRoutes = require("./routes/flight.routes");
const bookingRoutes = require("./routes/booking.routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Airline Booking Home Page!");
});

app.use("/api/users", userRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorHandler);

module.exports = app;
