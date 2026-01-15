const express = require("express");
const router = express.Router();

const airlineOwnerMiddleware = require("../middlewares/airlineMiddleware");
const airlineController = require("../controllers/airline.controller");

router.post(
  "/create-airline",
  airlineOwnerMiddleware,
  airlineController.createAirline
);

router.get(
  "/my-airlines",
  airlineOwnerMiddleware,
  airlineController.getMyAirline
);

module.exports = router;
