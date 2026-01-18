const cacheClient = require("./cache.service");
const customErrors = require("../utils/customError");

const LOCK_TTL = 600; // 10 min (TTL = Time To Live)

module.exports.lockSeats = async ({ flightId, userId, seatNumbers }) => {
  for (const seat of seatNumbers) {
    const lockKey = `lock:${flightId}:${seat}`;

    const alreadyLocked = await cacheClient.get(lockKey);
    if (alreadyLocked) {
      throw new customErrors(`Seat ${seat} already locked`, 400);
    }
  }

  // Lock seats
  for (const seat of seatNumbers) {
    await cacheClient.set(`lock:${flightId}:${seat}`, userId, "EX", LOCK_TTL);
  }
};

module.exports.getLockedSeats = async (flightId) => {
  const keys = await cacheClient.keys(`lock:${flightId}:*`);
  return keys.map((k) => k.split(":")[2]); // extract seat number
};

module.exports.releaseSeats = async (flightId, seatNumbers) => {
  for (const seat of seatNumbers) {
    await cacheClient.del(`lock:${flightId}:${seat}`);
  }
};
