const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiration: {
    type: Date,
    expires: 300,
    required: true,
    default: () => new Date(Date.now() + 1 * 60 * 1000),
  },
});
const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
