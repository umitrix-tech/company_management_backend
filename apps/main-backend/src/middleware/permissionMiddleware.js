const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { rolePermissonCheck } = require("../service/auth.service");
const { ROLE_OWNER } = require("../utils/constData");

const permissionAuth = (accessKey) => {

    return async (req, res, next) => {

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

            if (decoded.deviceId && deviceId != decoded.deviceId) {
                throw new AppError("Signature Mismatch");
            }


            if (decoded.role != ROLE_OWNER) {
                await rolePermissonCheck(decoded, accessKey)
            }
            req["user"] = decoded;
            next();
        } catch (err) {
            throw new AppError(err.message, err.statusCode || 401);
        }
    };

}

module.exports = permissionAuth;

