
const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const tenantConfigService = async (req) => {
    try {
        const responce = await prisma.companyConfig.findFirst({
            where: {
                domain: String(req.headers?.hostdomain)
            }
        });
                
        return responce;
    } catch (error) {
        throw catchAsyncPrismaError(error);
    }
}

module.exports = {
    tenantConfigService
}