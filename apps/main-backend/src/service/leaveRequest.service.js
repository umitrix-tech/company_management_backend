const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * APPLY LEAVE
 */
const applyLeaveService = async (payload, user) => {
  try {
    const { leaveTypeId, startDate, endDate, reason } = payload;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const year = start.getFullYear();
    const month = start.getMonth(); // 0-11

    // 1. Calculate days count (inclusive)
    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // 2. Fetch LeaveType and Config
    const leaveType = await prisma.leaveType.findFirst({
      where: { id: Number(leaveTypeId), companyId: user.companyId, isDeleted: false },
      include: {
        configs: { where: { isDeleted: false } },
      },
    });

    if (!leaveType) throw new AppError("Leave type not found", 404);
    const config = leaveType.configs[0];
    if (!config) throw new AppError("Leave configuration not found", 404);

    // 3. Gender check
    if (config.gender && config.gender !== "ALL") {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser.gender !== config.gender) {
        throw new AppError(`This leave is only available for ${config.gender} employees`, 403);
      }
    }

    // 4. Consecutive days check
    if (config.maxConsecutiveDays && daysCount > config.maxConsecutiveDays) {
      throw new AppError(`You cannot apply for more than ${config.maxConsecutiveDays} consecutive days for this leave type`, 400);
    }

    // 5. Monthly Limit check
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

    // 6. Yearly Balance check
    let balance = await prisma.leaveBalance.findFirst({
      where: { userId: user.id, leaveTypeId: Number(leaveTypeId), year },
    });

    if (!balance) {
      // Initialize balance from yearly limit
      balance = await prisma.leaveBalance.create({
        data: {
          userId: user.id,
          leaveTypeId: Number(leaveTypeId),
          year,
          totalQuota: config.yearlyLimit,
          usedQuota: 0,
          companyId: user.companyId,
        },
      });
    }

    if (balance.usedQuota + daysCount > balance.totalQuota) {
      throw new AppError("Insufficient leave balance for the year", 400);
    }

    // 7. Create Request
    return await prisma.leaveRequest.create({
      data: {
        userId: user.id,
        leaveTypeId: Number(leaveTypeId),
        startDate: start,
        endDate: end,
        daysCount,
        reason,
        companyId: user.companyId,
      },
    });
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
      include: { leaveType: true },
    });

    if (!request) throw new AppError("Leave request not found", 404);
    if (request.status !== "PENDING") throw new AppError("Request already processed", 400);

    return await prisma.$transaction(async (tx) => {
      if (status === "APPROVED") {
        const year = new Date(request.startDate).getFullYear();
        
        // Update balance
        await tx.leaveBalance.update({
          where: {
            userId_leaveTypeId_year: {
              userId: request.userId,
              leaveTypeId: request.leaveTypeId,
              year,
            },
          },
          data: {
            usedQuota: { increment: request.daysCount },
          },
        });
      }

      return await tx.leaveRequest.update({
        where: { id: Number(id) },
        data: {
          status,
          approvedById: user.id,
          // We could store the approval reason in a separate field or extend schema
        },
      });
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
    const { userId, status, leaveTypeId, page = 1, limit = 10 } = query;
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
 * GET LEAVE BALANCE
 */
const getLeaveBalanceService = async (userId, user) => {
  try {
    const targetUserId = userId ? Number(userId) : user.id;
    const year = new Date().getFullYear();

    return await prisma.leaveBalance.findMany({
      where: { userId: targetUserId, year, companyId: user.companyId },
      include: {
        leaveType: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  applyLeaveService,
  approveLeaveService,
  listLeaveRequestsService,
  getLeaveBalanceService,
};
