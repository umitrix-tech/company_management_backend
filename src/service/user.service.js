const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER, TEMP_PASSWORD } = require("../utils/constData");
const { Prisma } = require("@prisma/client");


const userProfilesGetService = async (payload, user) => {
  try {
    const { id: targetUserId } = payload;
    const { id, companyId } = user;


    const responce = await prisma.user.findFirst({
      where: {
        id: parseInt(targetUserId),
        companyId: parseInt(companyId)
      }
    })

    if (!responce) {
      throw new AppError("User not found", 404);
    }

    return responce;
  } catch (error) {
    throw catchAsyncPrismaError(error)

  }
}

const userProfileListGetService = async (payload, user) => {
  try {
    const { page = 0, size = 20, search = "", sortOrder = "desc" } = payload;

    const skip = page * size;

    const sortOrderSafe = sortOrder === "asc" ? "ASC" : "DESC";
    const users = await prisma.$queryRaw`
  SELECT
    u.*, r."name" AS "roleName",
   COUNT(*) OVER()::INT AS total_count
  FROM "User" u
  JOIN "Role" r ON r.id = u."roleId"
  WHERE
    u."companyId" = ${user.companyId}
    AND u."isDetele" = false
    AND r."name" != ${ROLE_OWNER}
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

    const totalCount = users.length > 0 ? users[0].total_count : 0;

    return { data: users, page, size, totalCount };

  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
}


const createUserService = async (payload, user) => {

  try {
    const { companyId = "" } = user;

    if (!companyId) {
      throw new AppError("you cant create employe without company", 400);
    }

    const password = await bcrypt.hash(TEMP_PASSWORD, 10);


    const userCreate = await prisma.user.create({
      data: {
        ...payload,
        companyId,
        password,
      },
    });

    return { ...userCreate, password: TEMP_PASSWORD };

  } catch (err) {

    throw catchAsyncPrismaError(err);
  }

}

const userProfileDeleteService = async (payload, user) => {
  try {

    const { id } = payload;
    const { companyId = "" } = user;

    if (!id) {
      throw new AppError("user id is required", 400);
    }



    if (!companyId) {
      throw new AppError("you cant create employe without company", 400);
    }

    let checkHisCompanyUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        companyId: parseInt(companyId),
      },
    });

    if (!checkHisCompanyUser) {
      throw new AppError("you cant update this user", 400);
    };

    const userUpdate = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDetele: true
      },
    })
    return userUpdate;

  } catch (error) {
    throw catchAsyncPrismaError(error);

  }
}


const userProfileUpdateService = async (payload, user) => {

  try {
    const { id } = payload;
    const { companyId = "" } = user;

    if (!id) {
      throw new AppError("user id is required", 400);
    }



    if (!companyId) {
      throw new AppError("you cant create employe without company", 400);
    }

    let checkHisCompanyUser = await prisma.user.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!checkHisCompanyUser) {
      throw new AppError("you cant update this user", 400);
    };

    const userUpdate = await prisma.user.update({
      where: { id },
      data: {
        ...payload,
      },
    })

    return userUpdate;

  } catch (err) {

    throw catchAsyncPrismaError(err);
  }
}

module.exports = {
  userProfilesGetService,
  userProfileListGetService,
  createUserService,
  userProfileUpdateService,
  userProfileDeleteService
}