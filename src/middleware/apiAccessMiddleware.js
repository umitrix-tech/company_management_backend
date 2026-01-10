const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const prisma = require("../../prisma");

module.exports = async function (screenKey, req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        throw new AppError("Access Denied. No token provided.", 401);
    }



    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req["user"] = decoded;
        console.log(decoded, 'decoded');

        const access = await prisma.rolePermission.findUnique({
            where: {
                role_id: decoded?.roleId,
                key: screenKey,
                companyId: decoded?.companyId,
            },
        })

        if (!access || !access.access) {
            throw new AppError("Access Denied.", 403);
        }

        next();
    } catch (err) {
        throw new AppError("Invalid token.", 401);
    }
};


