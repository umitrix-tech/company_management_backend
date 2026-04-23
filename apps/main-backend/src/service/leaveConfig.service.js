const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE LEAVE TYPE & CONFIG
 */
const createLeaveTypeService = async (payload, user) => {
  try {
    const { name, code, isPaid, config } = payload;

    return await prisma.leaveType.create({
      data: {
        name,
        code,
        isPaid,
        companyId: user.companyId,
        configs: {
          create: {
            ...config,
            companyId: user.companyId,
          },
        },
      },
      include: {
        configs: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE LEAVE TYPE & CONFIG
 */
const updateLeaveTypeService = async (payload, user) => {
  try {
    const { id, name, code, isPaid, config } = payload;

    const existing = await prisma.leaveType.findFirst({
      where: { id: Number(id), companyId: user.companyId, isDeleted: false },
    });

    if (!existing) {
      throw new AppError("Leave type not found", 404);
    }

    return await prisma.$transaction(async (tx) => {
      // Update LeaveType
      const updatedType = await tx.leaveType.update({
        where: { id: Number(id) },
        data: { name, code, isPaid },
      });

      // Update Config if provided
      if (config) {
        // Find existing config
        const existingConfig = await tx.leaveConfiguration.findFirst({
          where: { leaveTypeId: Number(id), isDeleted: false },
        });

        if (existingConfig) {
          await tx.leaveConfiguration.update({
            where: { id: existingConfig.id },
            data: config,
          });
        } else {
          await tx.leaveConfiguration.create({
            data: {
              ...config,
              leaveTypeId: Number(id),
              companyId: user.companyId,
            },
          });
        }
      }

      return await tx.leaveType.findUnique({
        where: { id: Number(id) },
        include: { configs: true },
      });
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE LEAVE TYPE
 */
const deleteLeaveTypeService = async (id, user) => {
  try {
    const existing = await prisma.leaveType.findFirst({
      where: { id: Number(id), companyId: user.companyId, isDeleted: false },
    });

    if (!existing) {
      throw new AppError("Leave type not found", 404);
    }

    return await prisma.leaveType.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST LEAVE TYPES
 */
const listLeaveTypesService = async (query, user) => {
  try {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      isDeleted: false,
    };

    const [data, total] = await Promise.all([
      prisma.leaveType.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          configs: {
            where: { isDeleted: false }
          },
        },
      }),
      prisma.leaveType.count({ where }),
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
  createLeaveTypeService,
  updateLeaveTypeService,
  deleteLeaveTypeService,
  listLeaveTypesService,
};
