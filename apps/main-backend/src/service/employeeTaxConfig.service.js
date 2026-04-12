const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
const createEmployeeTaxConfigService = async (payload, user) => {
  try {
    return await prisma.employeeTaxConfig.create({
      data: {
        userId: Number(payload.userId),
        // regime: payload.regime,
        standardDeduction: payload.standardDeduction,
        declared80C: payload.declared80C,
        effectiveFrom: new Date(payload.effectiveFrom),
        effectiveTo: payload.effectiveTo ? new Date(payload.effectiveTo) : null,
        companyId: user.companyId,
      },
      omit: {
        companyId: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updateEmployeeTaxConfigService = async (payload, user) => {
  try {
    const { id } = payload;

    const existing = await prisma.employeeTaxConfig.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Employee tax config not found", 404);
    }

    return await prisma.employeeTaxConfig.update({
      where: { id: Number(id) },
      data: {
        // regime: payload.regime,
        standardDeduction: payload.standardDeduction,
        declared80C: payload.declared80C,
        effectiveFrom: payload.effectiveFrom ? new Date(payload.effectiveFrom) : undefined,
        effectiveTo: payload.effectiveTo ? new Date(payload.effectiveTo) : payload.effectiveTo === null ? null : undefined,
      },
      omit: {
        companyId: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
const deleteEmployeeTaxConfigService = async (id, user) => {
  try {
    const existing = await prisma.employeeTaxConfig.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Employee tax config not found", 404);
    }

    return await prisma.employeeTaxConfig.delete({
      where: { id: Number(id) },
      omit: {
        companyId: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getEmployeeTaxConfigService = async (id, user) => {
  try {
    const data = await prisma.employeeTaxConfig.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            empCode: true,
          },
        },
      },
      omit: {
        companyId: true,
      },
    });

    if (!data) {
      throw new AppError("Employee tax config not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listEmployeeTaxConfigService = async (query, user) => {
  try {
    const {
      userId,
      // regime,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
      // ...(regime && { regime }),
    };

    const [data, total] = await Promise.all([
      prisma.employeeTaxConfig.findMany({
        where,
        orderBy: { effectiveFrom: "desc" },
        skip: Number(skip),
        take: Number(limit),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              empCode: true,
            },
          },
        },
        omit: {
          companyId: true,
        },
      }),
      prisma.employeeTaxConfig.count({ where }),
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
  createEmployeeTaxConfigService,
  updateEmployeeTaxConfigService,
  deleteEmployeeTaxConfigService,
  getEmployeeTaxConfigService,
  listEmployeeTaxConfigService,
};
