const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  const deviceId = req.header("deviceId");

  if (!deviceId) {
    throw new AppError("Access Denied. No device id provided.", 401);
  }

  if (!token) {
    throw new AppError("Access Denied. No token provided.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded,'decoded');
    
    if (decoded.deviceId && deviceId != decoded.deviceId) {
      throw new AppError("Signature Mismatch");
    }
    req["user"] = decoded;
    next();
  } catch (err) {
    throw new AppError(err.message, 401);
  }
};


