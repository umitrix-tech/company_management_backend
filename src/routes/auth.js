const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const { loginController, otpSendController, verifyOtpController } = require("../controller/auth.controller");

router.post("/login", validate(authValidator.login), loginController);
router.post("/otp/send", validate(authValidator.otpSend), otpSendController);
router.post("/otp/verify", validate(authValidator.verifyOtp), verifyOtpController);


module.exports = router;

