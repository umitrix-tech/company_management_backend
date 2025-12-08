const catchAsync = require("../utils/catchAsync");

const loginController = catchAsync(async (req, res) => {
  res.status(200).json({ message: "Login successful", data: "result" });
});

const registerController = catchAsync(async (req, res) => {
  res.status(200).json({ message: "User Register successfully", data: "result" });

});

module.exports = {
  loginController,
  registerController,
};
