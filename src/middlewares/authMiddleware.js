const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const cacheClient = require("../services/cache.service");
const userModel = require("../models/user.model");

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new customError("Access Denied. No token provided.", 401);
    }

    const blacklistedToken = await cacheClient.get(token);
    if (blacklistedToken) {
      throw new customError("Token is blacklisted", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      throw new customError("User not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new customError("Authentication Failed", 401);
  }
};
