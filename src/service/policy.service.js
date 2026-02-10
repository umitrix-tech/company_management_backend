const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");

/**
 * CREATE
 */
const createPolicyService = async (payload, user) => {
  try {
    return await prisma.policy.create({
      data: {
        name: payload.name,
        description: payload.description,
        roleAccess: payload.roleAccess || [],
        mediaId: payload.mediaId || [],
        companyId: user.companyId,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updatePolicyService = async (payload, user) => {
  try {
    const { id } = payload;

    const existing = await prisma.policy.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.policy.update({
      where: { id: Number(id) },
      data: {
        name: payload.name,
        description: payload.description,
        roleAccess: payload.roleAccess,
        mediaId: payload.mediaId,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
const deletePolicyService = async (id, user) => {
  try {
    const existing = await prisma.policy.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.policy.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getPolicyService = async (id, user) => {
  try {
    const data = await prisma.policy.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
        ...(user.roleId && user.role != ROLE_OWNER && {
          roleAccess: {
            has: user.roleId
          }
        })
      },
      omit:{
        companyId:true
      }
    });

    if (!data) {
      throw new AppError("Record not found", 404);
    }

    let mediaDetails = await prisma.media.findMany({
      where: {
        id: { in: data.mediaId }
      }
    }) || {}



    return {
      ...data,
      mediaDetails
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 * search + pagination + roleAccess filter
 */
const listPolicyService = async (query, user) => {
  try {
    const {
      search,
      page = 1,
      size = 10,
    } = query;

    const skip = (page - 1) * size;

    if (!user.roleId) {
      throw new AppError("You are not a valid user to access this", 403);
    }

    const where = {
      companyId: user.companyId,

      ...(user.roleId && user.role !== ROLE_OWNER && {
        roleAccess: {
          has: user.roleId,
        },
      }),

      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };


    const [data, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        orderBy: { id: "desc" },
        skip: Number(skip),
        take: Number(size),
        omit: {
          roleAccess: true,
        },
      }),
      prisma.policy.count({ where }),
    ]);


    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(size),
        totalPages: Math.ceil(total / size),
      },
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  createPolicyService,
  updatePolicyService,
  deletePolicyService,
  getPolicyService,
  listPolicyService,
};
