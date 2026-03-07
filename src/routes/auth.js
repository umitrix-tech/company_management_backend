const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const {
  loginController,
  otpSendController,
  verifyOtpController,
  infoController,
} = require("../controller/auth.controller");
const jwt = require("jsonwebtoken");
const passport = require('../utils/passport')

const auth = require("../middleware/auth.middleware");

router.post("/login", validate(authValidator.login), loginController);
router.get("/info", auth, infoController);
router.post("/otp/send", validate(authValidator.otpSend), otpSendController);
router.post(
  "/otp/verify",
  validate(authValidator.verifyOtp),
  verifyOtpController,
);


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  (req, res) => {

    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:5500/success.html?token=${token}`);
  }
);

module.exports = router;