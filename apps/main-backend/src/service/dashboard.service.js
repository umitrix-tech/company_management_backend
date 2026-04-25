const prisma = require("@umitrix/database");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * Get Dashboard Counts and Stats
 */
const getDashboardStatsService = async (user) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const companyId = user.companyId;

    const [
      totalEmployees,
      totalPresent,
      totalHoliday,
      notesCount,
      reminderCount,
      callStats,
      additionalStats
    ] = await Promise.all([
      // Total Employees
      prisma.user.count({
        where: { companyId, isDetele: false },
      }),
      // Total Present Today
      prisma.attendance.count({
        where: {
          companyId,
          date: today,
          isPresent: true,
        },
      }),
      // Total Holiday (Today or upcoming)
      prisma.particularDateConfig.count({
        where: {
          companyId,
          date: { gte: today },
        },
      }),
      // Total Notes
      prisma.notes.count({
        where: { companyId },
      }),
      // Reminders (Notes with future/today startDate)
      prisma.notes.count({
        where: {
          companyId,
          startDate: { gte: today },
        },
      }),
      // Call Stats
      prisma.callHistory.aggregate({
        where: { companyId },
        _count: { id: true },
        _sum: { callDuration: true },
      }),
      // Pending/Ongoing Calls
      prisma.callHistory.groupBy({
        by: ['callStatus'],
        where: { companyId },
        _count: { id: true }
      })
    ]);

    // Format Call Stats
    const statusCounts = additionalStats.reduce((acc, curr) => {
      acc[curr.callStatus] = curr._count.id;
      return acc;
    }, {});

    // Active Loans, Reviews, Ratings
    const [activeLoans, reviewStats] = await Promise.all([
      prisma.loan.count({
        where: { companyId, status: "ACTIVE" }
      }),
      prisma.review.aggregate({
        where: { companyId },
        _count: { id: true },
        _avg: { rating: true }
      })
    ]);

    return {
      totalEmployees,
      totalPresent,
      totalAbsent: Math.max(0, totalEmployees - totalPresent),
      totalHoliday,
      notesCount,
      reminderCount,
      calls: {
        total: callStats._count.id,
        pending: statusCounts["PENDING"] || 0,
        ongoing: statusCounts["ONGOING"] || 0,
        completed: statusCounts["COMPLETED"] || 0,
        totalDuration: callStats._sum.callDuration || 0,
      },
      loans: {
        active: activeLoans
      },
      reviews: {
        total: reviewStats._count.id,
        averageRating: reviewStats._avg.rating || 0
      }
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * Get Upcoming Timeline
 */
const getUpcomingTimelineService = async (user) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return await prisma.timeLine.findMany({
      where: {
        companyId: user.companyId,
        date: { gte: today }
      },
      orderBy: { date: "asc" },
      take: 5
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * Get Chart Data (Employee Growth and Salary Growth)
 */
const getDashboardChartDataService = async (user) => {
  try {
    const companyId = user.companyId;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Employee Growth (Count per month)
    const users = await prisma.user.findMany({
      where: {
        companyId,
        isDetele: false,
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true }
    });

    // Salary Growth (Sum netPay per month)
    const salarySlips = await prisma.salarySlip.findMany({
      where: {
        companyId,
        generatedAt: { gte: sixMonthsAgo }
      },
      select: { netPay: true, generatedAt: true }
    });

    // Process data for charts
    const chartData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      const empCount = users.filter(u => {
        const uDate = new Date(u.createdAt);
        return uDate.getMonth() === d.getMonth() && uDate.getFullYear() === d.getFullYear();
      }).length;

      const salTotal = salarySlips
        .filter(s => {
          const sDate = new Date(s.generatedAt);
          return sDate.getMonth() === d.getMonth() && sDate.getFullYear() === d.getFullYear();
        })
        .reduce((sum, curr) => sum + curr.netPay, 0);

      chartData.push({
        month: monthLabel,
        employeeGrowth: empCount,
        salaryGrowth: salTotal
      });
    }

    return chartData;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * Get Leave and Permission Dashboard Stats
 */
const getLeavePermissionDashboardService = async (data, user) => {
  try {
    let { date } = data;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);


    // if (isNaN(date.getTime())) {
    //   throw new Error("Invalid date");
    // }

    console.log(startOfDay, endOfDay);

    const companyId = user.companyId;

    const [leaveStats, permissionStats] = await Promise.all([
      prisma.leaveRequest.groupBy({
        by: ['status'],
        where: {
          companyId,
          startDate: { gte: startOfDay },
          endDate: { lte: endOfDay }
        },
        _count: { id: true }
      }),
      prisma.permissionRequest.groupBy({
        by: ['status'],
        where: {
          companyId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _count: { id: true },

      })
    ]);

    const formatStats = (stats) => {
      const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
      stats.forEach(s => {
        counts[s.status] = s._count.id;
      });
      return counts;
    };

    const leaveCounts = formatStats(leaveStats);
    const permissionCounts = formatStats(permissionStats);

    return {
      overallLeave: Object.values(leaveCounts).reduce((a, b) => a + b, 0),
      overallPermission: Object.values(permissionCounts).reduce((a, b) => a + b, 0),
      leavePending: leaveCounts.PENDING,
      permissionPending: permissionCounts.PENDING,
      leaveApproved: leaveCounts.APPROVED,
      permissionApproved: permissionCounts.APPROVED,
      leaveRejected: leaveCounts.REJECTED,
      permissionRejected: permissionCounts.REJECTED
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * Get Paginated Employee List with Leave and Permission Requests
 */
// const employeeLeavePermissionListService = async (payload, user) => {
//   try {
//     const { page = 1, size = 10, search = "", date = "" } = payload;
//     let startDate = new Date(date);
//     startDate.setHours(0, 0, 0, 0);
//     let endDate = new Date(date);
//     endDate.setHours(23, 59, 59, 999);
//     const limit = parseInt(size);
//     const skip = (parseInt(page) - 1) * limit;
//     const companyId = user.companyId;

//     const where = {
//       companyId,
//       isDetele: false,
//       ...(search && {
//         OR: [
//           { name: { contains: search, mode: 'insensitive' } },
//           { empCode: { contains: search, mode: 'insensitive' } }
//         ]
//       })
//     };

//     const [employees, totalCount] = await Promise.all([
//       prisma.user.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           leaveRequests: {
//             include: { leaveType: true, approvedBy: { select: { name: true }, where:{

//             }  } }
//           },
//           permissionRequests: {
//             include: { approvedBy: { select: { name: true } } }
//           }
//         },
//         orderBy: { name: 'asc' }
//       }),
//       prisma.user.count({ where })
//     ]);

//     const formattedData = employees.map(emp => {
//       const leaves = emp.leaveRequests.map(l => ({
//         id: l.id,
//         type: 'leave',
//         typeName: l.leaveType.name,
//         reason: l.reason,
//         status: l.status,
//         createdAt: l.createdAt,
//         approvedBy: l.approvedBy?.name || null
//       }));

//       const permissions = emp.permissionRequests.map(p => ({
//         id: p.id,
//         type: 'permission',
//         typeName: 'Permission',
//         reason: p.reason,
//         status: p.status,
//         createdAt: p.createdAt,
//         approvedBy: p.approvedBy?.name || null
//       }));

//       return {
//         id: emp.id,
//         name: emp.name,
//         empCode: emp.empCode,
//         requests: [...leaves, ...permissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       };
//     });

//     return {
//       data: formattedData,
//       pagination: {
//         total: totalCount,
//         page: parseInt(page),
//         size: limit,
//         totalPages: Math.ceil(totalCount / limit)
//       }
//     };
//   } catch (error) {
//     throw catchAsyncPrismaError(error);
//   }
// };
const employeeLeavePermissionListService = async (payload, user) => {
  try {
    const { page = 1, size = 10, search = "" } = payload;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const limit = parseInt(size);
    const skip = (parseInt(page) - 1) * limit;

    const companyId = user.companyId;

    const data = await prisma.$queryRaw`SELECT U.name,
  COALESCE(
    json_agg(json_build_object(
        'id', LR."id",
        'startdate', LR."startDate",
        'endDate',LR."endDate"
      )) FILTER (WHERE LR."id" IS NOT NULL),
    '[]'
  ) as leave_reuest,
  COALESCE(
    json_agg(json_build_object(
        'id', PR."id",
        'date', PR."date"
      )) FILTER (WHERE PR."id" IS NOT NULL),
    '[]'
  ) as permission_reuest

FROM "User" U
LEFT JOIN "LeaveRequest" LR 
  ON LR."userId" = U."id"
  AND LR."startDate" >= ${startDate.toISOString()}
  AND LR."startDate" <= ${endDate.toISOString()}
LEFT JOIN "PermissionRequest" PR 
  ON PR."userId" = U."id"
  AND PR."date" >= ${startDate.toISOString()}
  AND PR."date" <= ${endDate.toISOString()}
WHERE 
  U."companyId" = ${companyId} AND U."isDetele" = false
GROUP BY U.id, U.name
ORDER BY (COUNT(DISTINCT LR.id) + COUNT(DISTINCT PR.id)) DESC

      LIMIT ${limit}
      OFFSET ${skip}
    `;

    const totalCount = await prisma.user.count({
      where: {
        companyId,
        isDetele: false
      }
    });


    return {
      data,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };

    // LEFT JOIN LeaveType lt ON lt.id = lr.leave_type_id
    //   LEFT JOIN User ab ON ab.id = lr.approved_by


  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  getDashboardStatsService,
  getUpcomingTimelineService,
  getDashboardChartDataService,
  getLeavePermissionDashboardService,
  employeeLeavePermissionListService
};
