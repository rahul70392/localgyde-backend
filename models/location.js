const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  locationID: String,
  locationName: String,
  guideId: [String],
  totalCompletedBookings: Number,
  completedBookings: [String],
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
