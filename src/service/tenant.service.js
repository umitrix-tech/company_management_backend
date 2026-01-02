const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const tenantConfigService = async (req) => {
    try {
        console.log(req.headers,'head');
        
        const responce = await prisma.companyConfig.findFirst({
            where: {
                domain: req.headers.host
            }
        })
        console.log(responce,'responce');
        
        return responce;
    } catch (error) {
        return catchAsyncPrismaError(error);
    }
}

module.exports = {
    tenantConfigService
}