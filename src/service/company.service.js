const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");

const createCompanyService = async (payload, user) => {
    try {

        const company = await prisma.company.findUnique({
            where: {
                email: payload.email,
                gstinNumber: payload?.gstinNumber,
                epfNumber: payload?.epfNumber,
                esiNumber: payload?.esiNumber,
                panNumber: payload?.panNumber,
            },
        });

        if (company) {
            throw new AppError("Company already exist with above detail", 409);
        }

        let responce = await prisma.company.create({
            data: {
                ownerUserId: user.id,
                ...payload
            }
        });


        const role = await prisma.role.create({
            data: {
                name: ROLE_OWNER,
                companyId: responce.id,
            },
        });

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                companyId: responce.id,
                roleId: role.id,
            }
        })

        return responce;
    } catch (err) {
        console.log(err, 'err');

        throw catchAsyncPrismaError(err);
    }
};


const companyUpdateService = async (payload, user) => {
    try {

        const { id } = payload;

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        console.log(company,';com');
        


        if (!company) {
            throw new AppError("Company not found", 404);
        }

        if (company.ownerUserId != user.id) {
            throw new AppError("You are not authorized to update this company", 403);
        }

        return await prisma.company.update({ where: { id }, data: payload });
    } catch (err) {
        throw catchAsyncPrismaError(err);
    }
}


module.exports = { createCompanyService, companyUpdateService };