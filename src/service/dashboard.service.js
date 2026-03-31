const prisma = require("../../prisma");
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

module.exports = {
  getDashboardStatsService,
  getUpcomingTimelineService,
  getDashboardChartDataService
};
