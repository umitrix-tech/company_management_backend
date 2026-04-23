const prisma = require("@umitrix/database");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * GET CONFIG
 */
const getPermissionConfigService = async (user) => {
  try {
    let config = await prisma.permissionConfiguration.findFirst({
      where: { companyId: user.companyId },
    });

    if (!config) {
      // Create default if not exists
      config = await prisma.permissionConfiguration.create({
        data: {
          companyId: user.companyId,
          monthlyLimit: 2,
          maxHoursPerPermission: 2.0,
        },
      });
    }

    return config;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * SETUP / UPDATE CONFIG
 */
const setupPermissionConfigService = async (payload, user) => {
  try {
    const { monthlyLimit, maxMinutesPerPermission } = payload;

    const existing = await prisma.permissionConfiguration.findFirst({
      where: { companyId: user.companyId },
    });

    if (existing) {
      return await prisma.permissionConfiguration.update({
        where: { id: existing.id },
        data: { monthlyLimit, maxMinutesPerPermission },
      });
    } else {
      return await prisma.permissionConfiguration.create({
        data: {
          companyId: user.companyId,
          monthlyLimit,
          maxMinutesPerPermission: maxMinutesPerPermission,
        },
      });
    }
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const setupDeletePermissionConfigService = async (id, user) => {
  try {
    // Ensure the config belongs to the user's company
    const existing = await prisma.permissionConfiguration.findFirst({
      where: { id: parseInt(id), companyId: parseInt(user.companyId) },
    });

    if (!existing) {
      throw new Error("Permission configuration not found or access denied");
    }


    await prisma.permissionConfiguration.delete({ where: { id: parseInt(id) } });
    return existing;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  getPermissionConfigService,
  setupPermissionConfigService,
  setupDeletePermissionConfigService,
};
