const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");


const userProfilesGetService = (req, user) => {

}

const userProfileListGetService = ({ page = 0, size = 20, search = "", sortOrder = "desc" }, user) => {
    try {
        const skip = page * size;

        return prisma.user.findMany({
            where: {
                company: {
                    id: user.companyId
                },
                isDetele: false,

                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            empCode: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            mobileNumber: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
                AND: {
                    role: {
                        name: {
                            not: ROLE_OWNER
                        }
                    }
                }
            },
            orderBy: {
                createdAt: sortOrder
            },
            skip,
            take: size,
            omit: {
                isDetele: true,
                password: true,
                punchId: true,
                updatedAt: true,
                WorkHoursConfigurationId: true
            }
        })
    } catch (error) {
        return catchAsyncPrismaError(error);
    }
}

module.exports = {
    userProfilesGetService,
    userProfileListGetService
}