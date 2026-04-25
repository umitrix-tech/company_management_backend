const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * APPLY LEAVE
 */
const applyLeaveService = async (payload, user) => {
  try {
    const { leaveTypeId, startDate, endDate, reason, isHalfDay, halfDaySession } = payload;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const year = start.getFullYear();

    // 1. Calculate days count
    let daysCount = 0;
    if (isHalfDay) {
      daysCount = 0.5;
      // For half day, start and end date should usually be same, but we enforce 0.5
    } else {
      daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    const isThisDayAlreadyOnLeave = await prisma.leaveRequest.findFirst({
      where: {
        userId: user.id,
        status: { in: ["APPROVED", "PENDING"] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });


    if (isThisDayAlreadyOnLeave && isThisDayAlreadyOnLeave.isHalfDay) {
      if (halfDaySession === isThisDayAlreadyOnLeave.halfDaySession) {
        throw new AppError("You rasised leave request for this day already.Please check your leave request", 400);
      }
    } else if (isThisDayAlreadyOnLeave) {
      throw new AppError("You rasised leave request for this day already.Please check your leave request", 400);
    }


    // 2. Fetch LeaveType and Config
    const leaveType = await prisma.leaveType.findFirst({
      where: { id: Number(leaveTypeId), companyId: user.companyId, isDeleted: false },
      include: {
        configs: { where: { isActive: true, isDeleted: false } },
      },
    });

    if (!leaveType) throw new AppError("Leave type not found", 404);
    const config = leaveType.configs[0];
    if (!config) throw new AppError("Leave configuration not found", 404);

    // 3. Gender check
    if (config.gender && config.gender !== "ALL") {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (dbUser.gender === "" && config.gender !== "ALL") {
        throw new AppError(`Please provide the gender in your profile to apply for this leave`, 403);
      }
      if (dbUser.gender !== config.gender) {
        throw new AppError(`This leave is only available for ${config.gender} employees`, 403);
      }
    }

    // 4. Consecutive days check
    if (!isHalfDay && config.maxConsecutiveDays && daysCount > config.maxConsecutiveDays) {
      throw new AppError(`You cannot apply for more than ${config.maxConsecutiveDays} consecutive days for this leave type`, 400);
    }

    // 5. Monthly Limit check
    if (config.monthlyLimit) {
      const month = start.getMonth();
      const currentMonthStart = new Date(year, month, 1);
      const currentMonthEnd = new Date(year, month + 1, 0);

      const monthlyUsage = await prisma.leaveRequest.aggregate({
        where: {
          userId: user.id,
          leaveTypeId: Number(leaveTypeId),
          status: { in: ["APPROVED", "PENDING"] },
          startDate: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        _sum: { daysCount: true },
      });

      const usedThisMonth = monthlyUsage._sum.daysCount || 0;
      if (usedThisMonth + daysCount > config.monthlyLimit) {
        throw new AppError(`Monthly limit exceeded. You can only take ${config.monthlyLimit} days of this leave per month.`, 400);
      }
    }

    // 6. Yearly Balance check (DYNAMIC)
    if (config.yearlyLimit) {
      const currentYearStart = new Date(year, 0, 1);
      const currentYearEnd = new Date(year, 11, 31);

      const yearlyUsage = await prisma.leaveRequest.aggregate({
        where: {
          userId: user.id,
          leaveTypeId: Number(leaveTypeId),
          status: { in: ["APPROVED", "PENDING"] },
          startDate: { gte: currentYearStart, lte: currentYearEnd },
        },
        _sum: { daysCount: true },
      });

      const usedThisYear = yearlyUsage._sum.daysCount || 0;
      if (usedThisYear + daysCount > config.yearlyLimit) {
        throw new AppError(`Insufficient yearly leave balance. Available: ${config.yearlyLimit - usedThisYear} days`, 400);
      }
    }

    // 7. Create Request
    const newRequest = await prisma.leaveRequest.create({
      data: {
        userId: user.id,
        leaveTypeId: Number(leaveTypeId),
        startDate: start,
        endDate: end,
        daysCount,
        reason,
        isHalfDay: !!isHalfDay,
        halfDaySession: isHalfDay ? halfDaySession : null,
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
        sendNotification("LEAVE_REQUEST", {
          title: "New Leave Request",
          body: `${employee.name} has applied for a leave starting ${startDate}.`,
          leaveId: newRequest.id
        }, employee.manager.fcmToken);
      }
    } catch (notifErr) {
      console.error("Failed to send leave notification:", notifErr);
    }

    return newRequest;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE LEAVE
 */
const updateLeaveService = async (payload, user) => {
  try {
    const { id, leaveTypeId, startDate, endDate, reason, isHalfDay, halfDaySession } = payload;

    const request = await prisma.leaveRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Leave request not found", 404);
    if (request.status !== "PENDING") throw new AppError("Only pending requests can be updated", 400);
    if (request.userId !== user.id) throw new AppError("Access denied", 403);

    // Recalculate days count if dates or half-day changed
    let daysCount = request.daysCount;
    const finalStartDate = startDate ? new Date(startDate) : request.startDate;
    const finalEndDate = endDate ? new Date(endDate) : request.endDate;
    const finalIsHalfDay = isHalfDay !== undefined ? isHalfDay : request.isHalfDay;

    if (finalIsHalfDay) {
      daysCount = 0.5;
    } else if (startDate || endDate || isHalfDay !== undefined) {
      daysCount = Math.ceil((finalEndDate - finalStartDate) / (1000 * 60 * 60 * 24)) + 1;
    }

    return await prisma.leaveRequest.update({
      where: { id: Number(id) },
      data: {
        leaveTypeId: leaveTypeId ? Number(leaveTypeId) : undefined,
        startDate: finalStartDate,
        endDate: finalEndDate,
        daysCount,
        reason,
        isHalfDay: finalIsHalfDay,
        halfDaySession: finalIsHalfDay ? (halfDaySession !== undefined ? halfDaySession : request.halfDaySession) : null,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE / CANCEL LEAVE
 */
const deleteLeaveService = async (id, user) => {
  try {
    const request = await prisma.leaveRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Leave request not found", 404);
    if (Number(request.userId) !== user.id) {
      throw new AppError("Access denied", 403);
    }

    // If already approved, maybe we should just mark as CANCELLED instead of deleting?
    // User requested "entire crud", so I'll implement soft delete/cancel.
    return await prisma.leaveRequest.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED" },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET LEAVE BY ID
 */
const getLeaveByIdService = async (id, user) => {
  try {
    const data = await prisma.leaveRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
      include: {
        user: { select: { name: true, empCode: true } },
        leaveType: true,
        approvedBy: { select: { name: true } },
      },
    });
    if (!data) throw new AppError("Leave request not found", 404);
    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * APPROVE / REJECT LEAVE
 */
const approveLeaveService = async (payload, user) => {
  try {
    const { id, status, reason } = payload;

    const request = await prisma.leaveRequest.findFirst({
      where: { id: Number(id), companyId: user.companyId },
    });

    if (!request) throw new AppError("Leave request not found", 404);
    if (request.status !== "PENDING") throw new AppError("Request already processed", 400);

    return await prisma.leaveRequest.update({
      where: { id: Number(id) },
      data: {
        status,
        approvedById: user.id,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST LEAVE REQUESTS
 */
const listLeaveRequestsService = async (query, user) => {
  try {
    const { status, leaveTypeId, page = 1, limit = 10 } = query;
    const userId = user.id;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
      ...(status && { status }),
      ...(leaveTypeId && { leaveTypeId: Number(leaveTypeId) }),
    };

    const [data, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, empCode: true } },
          leaveType: true,
          approvedBy: { select: { name: true } },
        },
      }),
      prisma.leaveRequest.count({ where }),
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
 * GET LEAVE SUMMARY (taken, avail, overall)
 */
const getLeaveSummaryService = async (userId, user) => {
  try {
    const targetUserId = userId ? Number(userId) : user.id;
    const year = new Date().getFullYear();
    const currentYearStart = new Date(year, 0, 1);
    const currentYearEnd = new Date(year, 11, 31);

    // 1. Fetch all leave types and their configs
    const leaveTypes = await prisma.leaveType.findMany({
      where: { companyId: user.companyId, isDeleted: false },
      include: {
        configs: { where: { isActive: true, isDeleted: false } },
      },
    });

    // 2. Fetch all approved leaves for this year
    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: {
        userId: targetUserId,
        status: "APPROVED",
        startDate: { gte: currentYearStart, lte: currentYearEnd },
      },
    });

    // 3. Map and calculate
    return leaveTypes.map((type) => {
      const config = type.configs[0] || {};
      const taken = approvedLeaves
        .filter((l) => l.leaveTypeId === type.id)
        .reduce((sum, l) => sum + l.daysCount, 0);

      const overall = config.yearlyLimit || 0;
      const avail = Math.max(0, overall - taken);

      return {
        id: type.id,
        name: type.name,
        code: type.code,
        overall,
        taken,
        avail,
      };
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  applyLeaveService,
  updateLeaveService,
  deleteLeaveService,
  getLeaveByIdService,
  approveLeaveService,
  listLeaveRequestsService,
  getLeaveSummaryService,
};
