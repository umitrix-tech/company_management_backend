const {
  getDashboardStatsService,
  getUpcomingTimelineService,
  getDashboardChartDataService,
  getLeavePermissionDashboardService,
  employeeLeavePermissionListService
} = require("../service/dashboard.service");
const catchAsync = require("../utils/catchAsync");

const getDashboardDataController = catchAsync(async (req, res) => {
  const [stats, timeline, charts] = await Promise.all([
    getDashboardStatsService(req.user),
    getUpcomingTimelineService(req.user),
    getDashboardChartDataService(req.user)
  ]);

  res.status(200).json({
    message: "Dashboard data retrieved successfully",
    data: {
      stats,
      timeline,
      charts
    }
  });
});

const getLeavePermissionDashboardController = catchAsync(async (req, res) => {
  const data = await getLeavePermissionDashboardService(req.query, req.user);
  res.status(200).json({
    message: "Leave and Permission dashboard stats retrieved successfully",
    data
  });
});

const getEmployeeLeavePermissionListController = catchAsync(async (req, res) => {
  const data = await employeeLeavePermissionListService(req.query, req.user);
  res.status(200).json({
    message: "Employee leave and permission list retrieved successfully",
    data
  });
});

module.exports = {
  getDashboardDataController,
  getLeavePermissionDashboardController,
  getEmployeeLeavePermissionListController
};
