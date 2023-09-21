const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const guideSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  guideId: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  Name: {
    type: String,
    required: false,
  },
  financialDetails: {
    gst: String,
    pan: String,
    bankAccount: {
      ifsc: String,
      bankName: String,
      accountNo: String,
      nameInAccount: String,
    },
  },
  kycDetails: {
    adhar: { data: Buffer, contentType: String },
    drivingLicence: { data: Buffer, contentType: String },
  },
  totalCompleteBookings: Number,
  rating: Number,
  location: String,
  referralCode: {
    type: String,
    unique: true,
    required: false,
  },
  kycVerified: Boolean,
});

const Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;
