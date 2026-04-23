const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { getPermissionConfigService } = require("./permissionConfig.service");

/**
 * APPLY PERMISSION
 */
const applyPermissionService = async (payload, user) => {
  try {
    const { date, startTime, endTime, reason } = payload;
    const requestDate = new Date(date);
    const year = requestDate.getFullYear();
    const month = requestDate.getMonth();

    // 1. Calculate hours
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startTotalM = startH * 60 + startM;
    const endTotalM = endH * 60 + endM;
    
    if (endTotalM <= startTotalM) {
      throw new AppError("End time must be after start time", 400);
    }
    const hours = (endTotalM - startTotalM) / 60;

    // 2. Fetch Configuration
    const config = await getPermissionConfigService(user);

    // 3. Max hours per permission check
    if (hours > config.maxHoursPerPermission) {
      throw new AppError(`A single permission cannot exceed ${config.maxHoursPerPermission} hours`, 400);
    }

    // 4. Monthly frequency check
    const currentMonthStart = new Date(year, month, 1);
    const currentMonthEnd = new Date(year, month + 1, 0);

    const monthlyCount = await prisma.permissionRequest.count({
      where: {
        userId: user.id,
        status: { in: ["APPROVED", "PENDING"] },
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    });

    if (monthlyCount >= config.monthlyLimit) {
      throw new AppError(`Monthly permission limit (${config.monthlyLimit}) exceeded`, 400);
    }

    // 5. Create Request
    return await prisma.permissionRequest.create({
      data: {
        userId: user.id,
        date: requestDate,
        startTime,
        endTime,
        hours,
        reason,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * STATUS UPDATE
 */
const updatePermissionStatusService = async (payload, user) => {
  try {
    const { id, status } = payload;

    const request = await prisma.permissionRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Permission request not found", 404);
    if (request.status !== "PENDING") throw new AppError("Request already processed", 400);

    return await prisma.permissionRequest.update({
      where: { id: Number(id) },
      data: { status },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listPermissionsService = async (query, user) => {
  try {
    const { userId, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.permissionRequest.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { date: "desc" },
        include: {
          user: { select: { name: true, empCode: true } },
        },
      }),
      prisma.permissionRequest.count({ where }),
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
  applyPermissionService,
  updatePermissionStatusService,
  listPermissionsService,
};
