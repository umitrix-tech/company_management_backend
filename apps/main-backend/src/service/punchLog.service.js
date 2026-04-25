const { PunchLogType, workHoursModal, PunchSource } = require("@prisma/client");
const exceljs = require("exceljs");
const prisma = require("@umitrix/database");
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

const validatePunchTime = (type, finalWorkHours) => {
  if (!finalWorkHours) return;

  const now = new Date();

  // if (type === PunchLogType.IN && now < new Date(finalWorkHours.startTime)) {
  //   throw new AppError(
  //     `You can't punch in before ${finalWorkHours.startTime}`,
  //     400
  //   );
  // };

  // if (type === PunchLogType.OUT && now > new Date(finalWorkHours.endTime)) {
  //   throw new AppError(
  //     `You can't punch out after ${finalWorkHours.endTime}`,
  //     400
  //   );
  // }
};

const resolveWorkHoursForUser = async (user) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: Number(user.id),
      companyId: Number(user.companyId),
    },
  });

  if (!userInfo) {
    throw new AppError("User not found", 404);
  }

  if (!userInfo.WorkHoursConfigurationId) {
    throw new AppError(
      "User has not been assigned any work hours configuration",
      400
    );
  }

  const workConfig = await prisma.workHoursConfiguration.findFirst({
    where: { id: Number(userInfo.WorkHoursConfigurationId) },
  });

  if (!workConfig) {
    throw new AppError("Work hours configuration not found", 404);
  }

  let finalWorkHours = null;

  switch (workConfig.workHoursModal) {
    case workHoursModal.DAY_WHAT_EVER_TIME_COVER:
      finalWorkHours = null; // no restriction
      break;

    case workHoursModal.FULL_DAY_TIME_COVER:
      finalWorkHours = null;
      break;

    case workHoursModal.GENERAL_TIME_COVER:
      if (!workConfig.startTime || !workConfig.endTime) {
        throw new AppError(
          "Start time and end time are required for general time cover",
          400
        );
      }
      finalWorkHours = {
        startTime: workConfig.startTime,
        endTime: workConfig.endTime,
      };
      break;

    case workHoursModal.SHIFT_TIME_COVER:
      // you can expand later
      finalWorkHours = null;
      break;

    default:
      throw new AppError("Invalid work hours modal", 400);
  }

  return finalWorkHours;
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
    if (payload.targetUserId && payload.targetUserId !== user.id) {
      return punchInServiceOther(user, payload);
    }

    const finalWorkHours = await resolveWorkHoursForUser(user);

    validatePunchTime(PunchLogType.IN, finalWorkHours);

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
    if (payload.targetUserId && payload.targetUserId !== user.id) {
      return await punchOutServiceOther(user, payload);
    }

    const finalWorkHours = await resolveWorkHoursForUser(user);

    validatePunchTime(PunchLogType.OUT, finalWorkHours);

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

    let { startDate, endDate } = query;
    let userId = user.id;

    const dateFilter = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter.gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
      ...(Object.keys(dateFilter).length && { punchIn: dateFilter }),
    };

    const [data] = await Promise.all([
      prisma.punchLog.findMany({
        where,
        orderBy: { punchIn: "desc" },
      }),
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
      where: {
        companyId: user.companyId,
        date: dateFilter,
      }
    })



    return {
      data: groupedData,
      holidayList,
    };
  } catch (error) {
    console.log(error, 'rr');
    throw catchAsyncPrismaError(error);
  }
};


const listEmployeeAttendanceService = async (query, user) => {
  try {

    let { search, date, page = 1, pageSize = 10 } = query;

    page = Number(page);
    pageSize = Number(pageSize);

    const skip = (page - 1) * pageSize;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const whereUser = {
      companyId: user.companyId,

      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { empCode: { contains: search, mode: "insensitive" } }
        ]
      })
    };


    const [employees, total] = await Promise.all([
      prisma.user.findMany({
        where: whereUser,
        skip,
        take: pageSize,

        select: {
          id: true,
          name: true,
          empCode: true,

          punchLog: {
            where: {
              punchIn: {
                gte: start,
                lte: end
              }
            },
            orderBy: {
              punchIn: "desc"
            },
            take: 1
          }
        }
      }),

      prisma.user.count({
        where: whereUser
      })
    ]);

    const data = employees.map((emp) => {

      const log = emp.punchLog[0];

      let status = "ABSENT";

      if (log) {
        if (log.remarks === "LEAVE") status = "LEAVE";
        else status = "PRESENT";
      }

      return {
        id: emp.id,
        empCode: emp.empCode,
        name: emp.name,
        lastPunchIn: log?.punchIn || null,
        lastPunchOut: log?.punchOut || null,
        status
      };

    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };

  } catch (error) {
    console.log(error, "attendance list error");

    throw catchAsyncPrismaError(error);
  }
};

const employeeAttendanceDashboardService = async (query, user) => {

  try {

    const date = query.date ? new Date(query.date) : new Date();

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const companyId = user.companyId;

    // total employees
    const totalEmployees = await prisma.user.count({
      where: {
        companyId,
        isDetele: false
      }
    });

    // today's punch logs
    const logs = await prisma.punchLog.findMany({
      where: {
        companyId,
        punchIn: {
          gte: start,
          lte: end
        }
      },
      select: {
        userId: true,
        punchOut: true,
        punchSource: true
      }
    });

    const punchInSet = new Set();
    const punchOutSet = new Set();
    const webSet = new Set();
    const mobileSet = new Set();

    logs.forEach(log => {

      punchInSet.add(log.userId);

      if (log.punchOut) {
        punchOutSet.add(log.userId);
      }

      if (log.puchVia === PunchSource.BIOMETRIC) {
        webSet.add(log.userId);
      }

      if (log.puchVia === PunchSource.MOBILE || log.puchVia === PunchSource.WEB) {
        mobileSet.add(log.userId);
      }

    });

    const totalPunchIn = punchInSet.size;
    const totalPunchOut = punchOutSet.size;

    const notPunched = totalEmployees - totalPunchIn;

    return {
      totalEmployees,
      totalPunchIn,
      totalPunchOut,
      notPunched,
      webPunch: webSet.size,
      mobilePunch: mobileSet.size
    };

  } catch (error) {
    throw catchAsyncPrismaError(error);

  }

};

const particularEmployeeAttendanceService = async (query, user) => {
  try {
    let { startDate, endDate, userId } = query;

    const targetUser = await prisma.user.findFirst({
      where: {
        id: Number(userId),
        companyId: user.companyId,
      },
    });

    if (!targetUser) {
      throw new AppError("User not found or you don't have access", 404);
    }

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day
      dateFilter.lte = end;
    }

    const where = {
      userId: Number(userId),
      companyId: user.companyId,
      ...(Object.keys(dateFilter).length && { punchIn: dateFilter }),
    };



    const data = await prisma.punchLog.findMany({
      where,
      orderBy: { punchIn: "desc" },
    });

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
      where: {
        companyId: user.companyId,
        date: dateFilter,
      },
    });

    return {
      user: {
        id: targetUser.id,
        name: targetUser.name,
        empCode: targetUser.empCode,
      },
      data: groupedData,
      holidayList,
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const downloadPunchLogExcelService = async (query, user) => {
  try {
    const { userId, startDate, endDate } = query;

    let targetUserId = userId ? Number(userId) : user.id;

    const userDetails = await prisma.user.findFirst({
      where: {
        id: targetUserId,
        companyId: user.companyId,
      },
      select: {
        name: true,
        empCode: true,
        email: true,
      },
    });

    if (!userDetails) {
      throw new AppError("User not found or you don't have access", 404);
    }

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const where = {
      userId: targetUserId,
      companyId: user.companyId,
      ...(Object.keys(dateFilter).length && { punchIn: dateFilter }),
    };

    const logs = await prisma.punchLog.findMany({
      where,
      orderBy: { punchIn: "asc" },
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Punch Logs");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Employee Name", key: "empName", width: 25 },
      { header: "Employee Code", key: "empCode", width: 15 },
      { header: "Punch In", key: "punchIn", width: 25 },
      { header: "Punch Out", key: "punchOut", width: 25 },
      { header: "Source", key: "source", width: 15 },
      { header: "Remarks", key: "remarks", width: 15 },
    ];

    // Styling the header row
    worksheet.getRow(1).font = { bold: true };

    logs.forEach((log) => {
      worksheet.addRow({
        date: log.punchIn ? new Date(log.punchIn).toISOString().split("T")[0] : "-",
        empName: userDetails.name,
        empCode: userDetails.empCode,
        punchIn: log.punchIn ? new Date(log.punchIn).toLocaleString() : "-",
        punchOut: log.punchOut ? new Date(log.punchOut).toLocaleString() : "-",
        source: log.punchSource || "-",
        remarks: log.remarks || "-",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


module.exports = {
  listPunchLogService,
  punchInService,
  punchOutService,
  listEmployeeAttendanceService,
  employeeAttendanceDashboardService,
  downloadPunchLogExcelService,
  particularEmployeeAttendanceService,
}
