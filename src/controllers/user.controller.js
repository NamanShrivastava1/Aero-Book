const userModel = require("../models/user.model");
const customError = require("../utils/customError");

module.exports.registerUser = async (req, res, next) => {
  const { userName, email, phone, password, address } = req.body;
  try {
    if (!userName || !email || !phone || !password || !address) {
      throw new customError("All fields are required", 400);
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new customError("User already exists", 409);

    }

    const user = await userModel.create({
      userName,
      email,
      phone,
      password,
      address,
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

