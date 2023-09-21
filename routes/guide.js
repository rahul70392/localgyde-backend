const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideController");
const guideAuth = require("../middlewares/guideauth");

router.post("/guide/loginOrSignup", guideController.loginOrSignupGuide);

router.post("/guide/verify", guideController.verifyGuide);

router.put(
  "/guide/updateDetails",
  guideAuth,
  guideController.updateDetailsGuide
);

module.exports = router;
