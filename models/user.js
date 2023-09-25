const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
  userId: {
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
  bookingHistory: {
    type: [String],
    default: [],
  },
  scheduledBookings: {
    type: [String],
    default: [],
  },
  referralCode: {
    type: String,
    unique: true,
    required: false,
  },
  address: {
    completeAddress: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  geolocation: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
});
// userAddress

const User = mongoose.model("User", userSchema);

module.exports = User;
