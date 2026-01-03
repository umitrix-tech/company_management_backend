const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");
const { Prisma } = require("@prisma/client");


const userProfilesGetService = (req, user) => {

}

const userProfileListGetService = async ({ page = 0, size = 20, search = "", sortOrder = "desc" }, user) => {
  try {
    const skip = page * size;

    const sortOrderSafe = sortOrder === "asc" ? "ASC" : "DESC";
    const users = await prisma.$queryRaw`
  SELECT
    u.*,
    COUNT(*) OVER() AS total_count
  FROM "User" u
  JOIN "Role" r ON r.id = u."roleId"
  WHERE
    u."companyId" = ${user.companyId}
    AND u."isDetele" = false
    ${search
        ? Prisma.sql`
            AND (
              u."name" ILIKE ${'%' + search + '%'}
              OR u."empCode" ILIKE ${'%' + search + '%'}
              OR u."email" ILIKE ${'%' + search + '%'}
              OR u."mobileNumber" ILIKE ${'%' + search + '%'}
            )
          `
        : Prisma.empty
      }
  ORDER BY u."createdAt" ${Prisma.raw(sortOrderSafe)}
  OFFSET ${skip}
  LIMIT ${size};
`;


    console.log(users, 'user');


    return { data: users, page, size };

  } catch (error) {
    console.log(error, 'er');

    return catchAsyncPrismaError(error);
  }
}


const createUserService = async ({ payload, user }) => {

  try {
    const { companyId } = user;

    if (!companyId) {
      throw new AppError("you cant create employe without company", 400);
    }

    const userCreate = await prisma.user.create({
      data: {
        ...payload,
        companyId,
        roleId: 2,
      },
    });

    return userCreate;

  } catch (err) {
    return catchAsyncPrismaError(err);
  }

}

module.exports = {
  userProfilesGetService,
  userProfileListGetService
}