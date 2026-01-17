const { PunchLogType } = require("@prisma/client");
const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { getTodayRange } = require("../utils/utility");
const { moduleAccess } = require("../utils/constData");


const ensureNoActivePunchToday = async (userId, companyId) => {
  const { start, end } = getTodayRange();

  const activePunch = await prisma.punchLog.findFirst({
    where: {
      userId,
      companyId,
      punchOut: null,
      punchIn: {
        gte: start,
        lte: end,
      },
    },
  });

  if (activePunch) {
    throw new AppError("Already punched in. Please punch out first.", 400);
  }
};


const punchInServiceOther = async (user, payload) => {
  const { targetUserId, companyId } = payload;

  if (user.companyId !== companyId) {
    throw new AppError("Invalid company access", 403);
  }

  const userPermissions = await prisma.rolePermission.findFirst({
    where: {
      roleId: parseInt(user.roleId),
      companyId: user.companyId,
      key: moduleAccess.PUNCH_IN_PUNCH_OUT.EDIT_OTHER_PUNCH
    }
  });


  if (!userPermissions) {
    throw new AppError("You are not allowed to punch for other users", 403);
  }


  if (!user.permissions?.includes("PUNCH_FOR_OTHERS")) {
    throw new AppError("You are not allowed to punch for other users", 403);
  }

  await ensureNoActivePunchToday(targetUserId, companyId);

  return prisma.punchLog.create({
    data: {
      userId: targetUserId,
      punchIn: new Date(),
      remarks: PunchLogType.IN,
      updatedBy: user.id,
      companyId,
    },
  });
};

const punchInService = async (user, payload) => {
  try {
    // Punching for someone else
    if (payload.targetUserId && payload.targetUserId !== user.id) {
      return await punchInServiceOther(user, payload);
    }

    // Self punch
    await ensureNoActivePunchToday(user.id, user.companyId);

    return await prisma.punchLog.create({
      data: {
        userId: user.id,
        punchIn: new Date(),
        remarks: PunchLogType.IN,
        updatedBy: user.id,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


const getActivePunch = async (userId, companyId) => {
  const activePunch = await prisma.punchLog.findFirst({
    where: {
      userId,
      companyId,
      punchOut: null,
    },
    orderBy: {
      punchIn: "desc",
    },
  });

  if (!activePunch) {
    throw new AppError("No active punch found. Please punch in first.", 400);
  }

  return activePunch;
};


const punchOutServiceOther = async (user, payload) => {
  const { targetUserId, companyId } = payload;

  if (user.companyId !== companyId) {
    throw new AppError("Invalid company access", 403);
  }


  const activePunch = await getActivePunch(targetUserId, companyId);

  return prisma.punchLog.update({
    where: {
      id: activePunch.id,
    },
    data: {
      punchOut: new Date(),
      remarks: PunchLogType.OUT,
      updatedBy: user.id,
    },
  });
};


const punchOutService = async (user, payload) => {
  try {
    // Punching out for someone else
    if (payload.targetUserId && payload.targetUserId !== user.id) {
      return await punchOutServiceOther(user, payload);
    }

    // Self punch-out
    const activePunch = await getActivePunch(user.id, user.companyId);

    return await prisma.punchLog.update({
      where: {
        id: activePunch.id,
      },
      data: {
        punchOut: new Date(),
        remarks: PunchLogType.OUT,
        updatedBy: user.id,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


const listPunchLogService = async (query, user) => {
  try {
    let { userId, startDate, endDate, page, limit } = query;
    console.log(query, 'ae');

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
      ...(Object.keys(dateFilter).length && { punchIn: dateFilter }),
    };

    const [data, total] = await Promise.all([
      prisma.punchLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { punchIn: "desc" },
      }),
      prisma.punchLog.count({ where }),
    ]);

    // --- Group by date ---
    const formatDateKey = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}:${month}:${year}`;
    };

    const groupedData = data.reduce((acc, log) => {
      const dateKey = formatDateKey(log.punchIn);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {});


    const holidayList = await prisma.particularDateConfig.findMany({
      where:{
        companyId: user.companyId,
        date: dateFilter,
      }
    })

    return {
      data: groupedData,
      holidayList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(error, 'rr');
    throw catchAsyncPrismaError(error);
  }
};


module.exports = {
  listPunchLogService,
  punchInService,
  punchOutService
}