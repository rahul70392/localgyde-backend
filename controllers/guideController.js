const twilioClient = require("../twilioConfig");
const jwt = require("jsonwebtoken");
const Guide = require("../models/guide");
const OTP = require("../models/otp");

async function loginOrSignupGuide(req, res) {
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
    throw new Error("Failed to send OTP");
  }
}

async function verifyGuide(req, res) {
  const { mobileNumber, verificationCode } = await req.body;
  try {
    const Otp = await OTP.findOne({ mobileNumber, otp: verificationCode });

    if (!Otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    const guide = await Guide.findOne({
      mobileNumber: Otp.mobileNumber,
    });
    if (!guide) {
      const newGuide = new Guide({
        mobileNumber: Otp.mobileNumber,
        Name: "",
        referralCode: generateReferralCode(),
        isVerified: true,
      });

      await newGuide.save();
      const token = generateJWT(newGuide._id);
      res.status(200).json({ Name: newGuide.Name, token });
    } else {
      // User exists, send back user information along with a JWT token
      // You can add more fields as needed
      const token = generateJWT(guide._id);
      res
        .status(200)
        .json({ Name: guide.Name, referralCode: guide.referralCode, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
function generateJWT(guideId) {
  const token = jwt.sign(
    {
      _id: guideId,
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
async function updateDetailsGuide(req, res) {
  try {
    const { Name } = req.body;
    const guideId = req.guide;
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    guide.Name = Name;
    await guide.save();

    res.status(200).json({ message: " Name updated successfully", guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  loginOrSignupGuide,
  verifyGuide,
  updateDetailsGuide,
};
