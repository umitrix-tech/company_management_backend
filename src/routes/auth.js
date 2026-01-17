const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const { loginController, otpSendController, verifyOtpController, infoController } = require("../controller/auth.controller");

const auth = require('../middleware/auth.middleware');

router.post("/login", validate(authValidator.login), loginController);
router.get("/info", auth, infoController)
router.post("/otp/send", validate(authValidator.otpSend), otpSendController);
router.post("/otp/verify", validate(authValidator.verifyOtp), verifyOtpController);


module.exports = router;

