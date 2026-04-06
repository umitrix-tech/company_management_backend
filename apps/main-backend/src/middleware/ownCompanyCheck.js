const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { ROLE_OWNER } = require("../utils/constData");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        throw new AppError("Access Denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req["user"] = decoded;

        if (decoded?.role != ROLE_OWNER) {
            throw new AppError("You don't have permission to access this resource.", 401);
        }

        next();
    } catch (err) {
        throw new AppError("Invalid token.", 401);
    }
};


