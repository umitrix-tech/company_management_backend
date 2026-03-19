const { loginService, otpSendService, verifyOtpService, infoService, forgotPasswordOtpService, passwordChangeService } = require("../service/auth.service");
const catchAsync = require("../utils/catchAsync");

const loginController = catchAsync(async (req, res) => {
  const deviceId = req.header("deviceId") || "";
  const responce = await loginService({ ...req.body, deviceId });
  res.status(200).json({ message: "Login successful", data: responce });
});                  

const infoController = catchAsync(async (req, res) => {
  const responce = await infoService(req.query, req.user);
  res.status(200).json({ message: "Login successful", data: responce });
})

const otpSendController = catchAsync(async (req, res) => {
  const responce = await otpSendService(req.body);
  res.status(200).json({ message: "Otp Send succssfully", data: responce });
});

const forgotPasswordOtpContrller = catchAsync(async (req, res) => {
  const responce = await forgotPasswordOtpService(req.body);
  res.status(200).json({ message: "Otp Send succssfully", data: responce });
});


const passwordChangeController =  catchAsync(async (req, res) => {
  const responce = await passwordChangeService(req.body, req.user);
  res.status(200).json({ message: "Password Changed Successfully", data: responce });
});


const verifyOtpController = catchAsync(async (req, res) => {
  const deviceId = req.header("deviceId") || "";
  const responce = await verifyOtpService({ ...req.body, deviceId });
  res.status(200).json({ message: "OTP verified successfully", data: responce });
});



module.exports = {
  loginController,
  otpSendController,
  verifyOtpController,
  infoController,
  forgotPasswordOtpContrller,
  passwordChangeController
  // registerController,
};


