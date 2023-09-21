const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingID: String,
  userID: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User", // Reference to the User model
    required: true,
  },
  // guideID: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Guide", // Reference to the Guide model
  //   required: true,
  // },
  // locationID: String,
  // userName: {
  //   type: String,
  //   required: true,
  // },
  // bookingType: {
  //   type: String,
  //   enum: ["Hourly", "Daily"],
  // },
  // bookingDates: {
  //   startDate: Date,
  //   endDate: Date,
  // },
  status: {
    type: String,
    enum: ["Completed", "Scheduled", "Cancelled", "Initiated"],
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
