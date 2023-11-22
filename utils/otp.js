const crypto = require("crypto");
const otplib = require("otplib");

const generateOtp = () => {
  return otplib.authenticator.generate(secretKey);
};

module.exports = { generateOtp };
