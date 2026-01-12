const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minLength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  if (!token) {
    throw new customError("Token generation failed", 500);
  }
  return token;
};

userSchema.statics.authenticateUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new customError("User Not Found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new customError("Invalid Credentials", 401);
  }
  return user;
};

module.exports = mongoose.model("user", userSchema);
