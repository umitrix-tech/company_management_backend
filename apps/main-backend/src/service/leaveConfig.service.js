const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { Prisma } = require("@prisma/client");

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
      where: {
        id: Number(id),
        companyId: user.companyId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new AppError("Leave type not found", 404);
    }

    return await prisma.$transaction(async (tx) => {
      // ✅ Step 1: Update LeaveType
      const updatedType = await tx.leaveType.update({
        where: { id: Number(id) },
        data: { name, code, isPaid },
      });

      // ✅ Step 2: Handle config versioning
      if (config) {
        // Get current active config
        const existingConfig = await tx.leaveConfiguration.findFirst({
          where: {
            leaveTypeId: Number(id),
            isActive: true,
            isDeleted: false,
          },
          orderBy: { version: "desc" },
        });

        const isConfigChanged =
          config &&
          existingConfig &&
          (config.monthlyLimit !== existingConfig.monthlyLimit ||
            config.yearlyLimit !== existingConfig.yearlyLimit ||
            config.gender !== existingConfig.gender ||
            config.canCarryForward !== existingConfig.canCarryForward ||
            config.maxConsecutiveDays !== existingConfig.maxConsecutiveDays);

        // 🔹 If config exists → deactivate it
        if (isConfigChanged) {
          await tx.leaveConfiguration.update({
            where: { id: existingConfig.id },
            data: { isActive: false },
          });

          await tx.leaveConfiguration.create({
            data: {
              ...config,
              leaveTypeId: Number(id),
              companyId: user.companyId,
              version: existingConfig ? existingConfig.version + 1 : 1,
              isActive: true,
            },
          });
        }

        // 🔹 Create new config (versioned)
      }

      // ✅ Step 3: Return updated data
      return await tx.leaveType.findUnique({
        where: { id: Number(id) },
        include: {
          configs: {
            where: { isDeleted: false , isActive: true},
            orderBy: { version: "desc" },
          },
        },
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
    const { page = 1, limit = 10, id= null } = query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      isDeleted: false,
      ...(id && { id: Number(id) }),
    };

    const [data, total] = await Promise.all([
      prisma.leaveType.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          configs: {
            where: { isDeleted: false },
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
