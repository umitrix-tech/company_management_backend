const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");

/**
 * CREATE
 */
const createTimeLineService = async (payload, user) => {
  try {
    return await prisma.timeLine.create({
      data: {
        date: new Date(payload.date),
        name: payload.reason, // mapped correctly
        description: payload.description,
        roleAccess: payload.roleAccess || [], // [1,2,3]
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
const updateTimeLineService = async (payload, user) => {
  try {
    const { id } = payload;

    const existing = await prisma.timeLine.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.timeLine.update({
      where: { id: Number(id) },
      data: {
        date: payload.date ? new Date(payload.date) : undefined,
        name: payload.reason,
        description: payload.description,
        roleAccess: payload.roleAccess, // optional update
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


/**
 * DELETE
 */
const deleteTimeLineService = async (id, user) => {
  try {
    const existing = await prisma.timeLine.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.timeLine.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


/**
 * GET BY ID
 */
const getTimeLineService = async (id, user) => {
  try {
    const data = await prisma.TimeLine.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!data) {
      throw new AppError("Record not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


/**
 * LIST
 * search + date filter + pagination
 */
const listTimeLineService = async (query, user) => {
  try {
    const {
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    if(!user.roleId){
      throw AppError("your not a valid user to access this")
    }

    const where = {
      companyId: user.companyId,

      ...(user.roleId && user.role != ROLE_OWNER && {
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

      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.timeLine.findMany({
        where,
        orderBy: { date: "desc" },
        skip: Number(skip),
        take: Number(limit),
        omit:{
          roleAccess:true
        }
      }),
      prisma.timeLine.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};



module.exports = {
  createTimeLineService,
  updateTimeLineService,
  deleteTimeLineService,
  getTimeLineService,
  listTimeLineService
}