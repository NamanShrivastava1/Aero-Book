const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get(
  "/profile",
  authMiddleware.authMiddleware,
  userController.getUserProfile
);
router.post(
  "/logout",
  authMiddleware.authMiddleware,
  userController.logoutUser
);

module.exports = router;
