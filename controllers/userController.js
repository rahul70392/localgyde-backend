require("dotenv").config();
const twilioClient = require("../twilioConfig");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const OTP = require("../models/otp");
const Booking = require("../models/booking");

async function loginOrSignupUser(req, res) {
  const { mobileNumber } = req.body;
  try {
    const existingOtp = await OTP.findOne({ mobileNumber });
    if (existingOtp) {
      await OTP.deleteOne({ mobileNumber });
    }
    const otp = generateOTP();
    const Otp = new OTP({
      mobileNumber,
      otp,
    });
    await Otp.save();
    await sendOTPviaSMS(mobileNumber, otp);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
async function sendOTPviaSMS(mobileNumber, otp) {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      from: "+12568183690",
      to: mobileNumber,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
}

async function verifyUser(req, res) {
  const { mobileNumber, verificationCode } = await req.body;
  try {
    const Otp = await OTP.findOne({ mobileNumber, otp: verificationCode });

    if (!Otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    const user = await User.findOne({
      mobileNumber: Otp.mobileNumber,
    });
    if (!user) {
      const newUser = new User({
        mobileNumber: Otp.mobileNumber,
        Name: "",
        referralCode: generateReferralCode(),
        isVerified: true,
      });

      await newUser.save();
      const token = generateJWT(newUser._id);
      res.status(200).json({ Name: newUser.Name, token });
    } else {
      const token = generateJWT(user._id);
      res
        .status(200)
        .json({ Name: user.Name, referralCode: user.referralCode, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
function generateJWT(userId) {
  const token = jwt.sign(
    {
      _id: userId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
}
function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;
  let referralCode = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }
  return referralCode;
}

async function updateDetailsUser(req, res) {
  try {
    const { Name } = req.body;
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.Name = Name;
    await user.save();

    res.status(200).json({ message: " Name updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function BookingUser(req, res) {
  try {
    const { guideId, locationId, bookingType, bookingDates, status } = req.body;
    const userId = req.user;
    const booking = new Booking({
      userID: userId,
      guideId: guideId,
      locationId,
      bookingType,
      bookingDates,
      status,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking." });
  }
}
async function CancelBookingUser(req, res) {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  if (req.user.id !== booking.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // If the user is authenticated and the user ID matches, cancel the booking
  booking.status = "Cancelled";
  await booking.save();

  return res.status(200).json({ message: "Booking cancelled successfully" });
}

module.exports = {
  loginOrSignupUser,
  verifyUser,
  updateDetailsUser,
  BookingUser,
  CancelBookingUser,
};
