const { loginService, otpSendService, verifyOtpService } = require("../service/auth.service");
const catchAsync = require("../utils/catchAsync");

const loginController = catchAsync(async (req, res) => {

  const responce = await loginService(req.body);
  res.status(200).json({ message: "Login successful", data: responce });
});

const otpSendController = catchAsync(async (req, res) => {
  const responce = await otpSendService(req.body);
  res.status(200).json({ message: "Otp Send succssfully", data: responce });
});


const verifyOtpController = catchAsync(async (req, res) => {
  const responce = await verifyOtpService(req.body);
  res.status(200).json({ message: "OTP verified successfully", data: responce });
});



module.exports = {
  loginController,
  otpSendController,
  verifyOtpController
  // registerController,
};


