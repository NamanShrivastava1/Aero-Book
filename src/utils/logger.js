const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({
      filename: "./logs/error.logs",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.logs" }),
  ],
});

module.exports = logger;