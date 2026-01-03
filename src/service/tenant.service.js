const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const tenantConfigService = async (req) => {
    try {
        const responce = await prisma.companyConfig.findFirst({
            where: {
                domain: req.headers.hostDomain
            }
        });
                
        return responce;
    } catch (error) {
        return catchAsyncPrismaError(error);
    }
}

module.exports = {
    tenantConfigService
}