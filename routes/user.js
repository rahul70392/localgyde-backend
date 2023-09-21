const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../middlewares/auth");

router.post("/loginOrSignup", userController.loginOrSignupUser);

router.post("/verify", userController.verifyUser);

router.put("/updateDetails", isAuth, userController.updateDetailsUser);

router.post("/Bookings", isAuth, userController.BookingUser);

router.post("/Cancel", isAuth, userController.CancelBookingUser);

module.exports = router;
