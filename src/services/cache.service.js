const Redis = require("ioredis");

const cacheClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

cacheClient.on("connect", () => {
  console.log("Redis connected!");
});

cacheClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

module.exports = cacheClient;
