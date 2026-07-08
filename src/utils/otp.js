const crypto = require("crypto");

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_ATTEMPTS = 5;

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  OTP_TTL_MS,
  RESET_TOKEN_TTL_MS,
  MAX_OTP_ATTEMPTS,
  generateOTP,
  hashValue,
  generateResetToken,
};
