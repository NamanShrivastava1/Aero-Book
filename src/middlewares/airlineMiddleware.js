const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const airlineModel = require("../models/airline.Model");
const customError = require("../utils/customError");
const cacheClient = require("../services/cache.service");

const airlineOwnerMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new customError("Authentication required", 401);
    }

    const isBlacklisted = await cacheClient.get(token);
    if (isBlacklisted) {
      throw new customError("Session expired, please login again", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      throw new customError("User not found", 401);
    }

    if (!user.isAirlineOwner) {
      throw new customError("Airline owner access only", 403);
    }

    const airline = await airlineModel.findOne({
      ownerUserId: user._id,
    });

    if (!airline) {
      throw new customError("Airline not found for this owner", 404);
    }

    req.user = user;
    req.airline = airline;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = airlineOwnerMiddleware;
