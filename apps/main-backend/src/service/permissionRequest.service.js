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
    const minutes = endTotalM - startTotalM;
    const hours = minutes / 60;

    // 2. Fetch Configuration
    const config = await getPermissionConfigService(user);

    if (!config) {
      throw new AppError("Permission configuration not found", 404);
    }

    // 3. Max hours per permission check
    if (minutes > config.maxMinutesPerPermission) {
      throw new AppError(`A single permission cannot exceed ${config.maxMinutesPerPermission / 60} hours`, 400);
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
    const newRequest = await prisma.permissionRequest.create({
      data: {
        userId: user.id,
        date: requestDate,
        startTime,
        endTime,
        minutes,
        reason,
        companyId: user.companyId,
      },
    });

    // Send Notification to Manager
    try {
      const employee = await prisma.user.findUnique({
        where: { id: user.id },
        include: { manager: { select: { fcmToken: true, name: true } } }
      });

      if (employee?.manager?.fcmToken) {
        const { sendNotification } = require("./notification.service");
        sendNotification("PERMISSION_REQUEST", {
          title: "New Permission Request",
          body: `${employee.name} has requested permission for ${date}.`,
          permissionId: newRequest.id
        }, employee.manager.fcmToken);
      }
    } catch (notifErr) {
      console.error("Failed to send permission notification:", notifErr);
    }

    return newRequest;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE PERMISSION
 */
const updatePermissionService = async (payload, user) => {
  try {
    const { id, date, startTime, endTime, reason } = payload;

    const request = await prisma.permissionRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Permission request not found", 404);
    if (request.status !== "PENDING") throw new AppError("Only pending requests can be updated", 400);
    if (request.userId !== user.id) throw new AppError("Access denied", 403);

    let hours = request.hours;
    if (startTime || endTime) {
      const finalStartTime = startTime || request.startTime;
      const finalEndTime = endTime || request.endTime;
      const [startH, startM] = finalStartTime.split(":").map(Number);
      const [endH, endM] = finalEndTime.split(":").map(Number);
      const startTotalM = startH * 60 + startM;
      const endTotalM = endH * 60 + endM;
      if (endTotalM <= startTotalM) throw new AppError("End time must be after start time", 400);
      hours = (endTotalM - startTotalM) / 60;
    }

    return await prisma.permissionRequest.update({
      where: { id: Number(id) },
      data: {
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        hours,
        reason,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE PERMISSION
 */
const deletePermissionService = async (id, user) => {
  try {
    const request = await prisma.permissionRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Permission request not found", 404);
    if (request.userId !== user.id) {
      throw new AppError("You are not authorized to perform this action", 403);
    }

    return await prisma.permissionRequest.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED" },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getPermissionByIdService = async (id, user) => {
  try {
    const data = await prisma.permissionRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
      include: {
        user: { select: { name: true, empCode: true } },
      },
    });
    if (!data) throw new AppError("Permission request not found", 404);
    return data;
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
      data: { 
        status,
        approvedById: user.id
      },
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

/**
 * GET PERMISSION SUMMARY
 */
const getPermissionSummaryService = async (userId, user) => {
  try {
    const targetUserId = userId ? Number(userId) : user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const currentMonthStart = new Date(year, month, 1);
    const currentMonthEnd = new Date(year, month + 1, 0);

    const config = await getPermissionConfigService(user);

    const taken = await prisma.permissionRequest.count({
      where: {
        userId: targetUserId,
        status: "APPROVED",
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    });

    const overall = config.monthlyLimit;
    const avail = Math.max(0, overall - taken);

    return {
      overall,
      taken,
      avail,
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  applyPermissionService,
  updatePermissionService,
  deletePermissionService,
  getPermissionByIdService,
  updatePermissionStatusService,
  listPermissionsService,
  getPermissionSummaryService,
};
