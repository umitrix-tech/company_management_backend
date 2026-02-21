
const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const tenantConfigService = async (req) => {
    try {

        if (!req.headers?.hostdomain) {
            throw new AppError("Host domain is required", 400);
        }

        const responce = await prisma.companyConfig.findFirst({
            where: {
                domain: String(req.headers?.hostdomain)
            }
        });

        if (!responce) {
            throw new AppError("Host domain not found", 404);
        }
                
        return responce;
    } catch (error) {
        throw catchAsyncPrismaError(error);
    }
}

module.exports = {
    tenantConfigService
}