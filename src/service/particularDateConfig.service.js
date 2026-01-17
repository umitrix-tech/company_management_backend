const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
exports.createParticularDateService = async (payload, user) => {
  try {
    return await prisma.particularDateConfig.create({
      data: {
        date: new Date(payload.date),
        reason: payload.reason,
        description: payload.description,
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
exports.updateParticularDateService = async (payload, user) => {
  try {
    const {id} = payload;
    const existing = await prisma.particularDateConfig.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.particularDateConfig.update({
      where: { id: Number(id) },
      data: {
        date: payload.date ? new Date(payload.date) : undefined,
        reason: payload.reason,
        description: payload.description,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
exports.deleteParticularDateService = async (id, user) => {
  try {
    const existing = await prisma.particularDateConfig.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.particularDateConfig.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
exports.getParticularDateService = async (id, user) => {
  try {
    const data = await prisma.particularDateConfig.findFirst({
      where: { id: Number(id), companyId: user.companyId },
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
exports.listParticularDateService = async (query, user) => {
  try {
    const {
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(search && {
        OR: [
          { reason: { contains: search, mode: "insensitive" } },
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
      prisma.particularDateConfig.findMany({
        where,
        orderBy: { date: "desc" },
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.particularDateConfig.count({ where }),
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
