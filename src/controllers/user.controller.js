const userModel = require("../models/user.model");
const customError = require("../utils/customError");
const cacheClient = require("../services/cache.service");
const logger = require("../utils/logger");

module.exports.registerUser = async (req, res, next) => {
  const { userName, email, phone, password, address, airlineOwnerSecret } =
    req.body;
  try {
    if (!userName || !email || !phone || !password || !address) {
      throw new customError("All fields are required", 400);
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new customError("User already exists", 409);
    }

    const isAirlineOwner =
      airlineOwnerSecret === process.env.AIRLINE_OWNER_SECRET;

    const user = await userModel.create({
      userName,
      email,
      phone,
      password,
      address,
      isAirlineOwner,
    });

    logger.info("User registered successfully", {
      userId: user._id,
      email: user.email,
    });

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAirlineOwner: user.isAirlineOwner,
      },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new customError("Email or Phone already in use", 409);
    }
    throw error;
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new customError("Email and Password are required", 400);
    }

    const user = await userModel.authenticateUser(email, password);

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    logger.info("User logged in", {
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    throw error;
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new customError("User not found", 404);
    }

    logger.info("User profile accessed", {
      userId: user._id,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    throw error;
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new customError("No token found", 400);
    }

    const blacklistedToken = await cacheClient.set(
      token,
      "blacklisted",
      "EX",
      3600
    );

    res.clearCookie("token");

    logger.info("User logged out", {
      token: token.slice(0, 10) + "...", // NEVER log full token
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    throw error;
  }
};
