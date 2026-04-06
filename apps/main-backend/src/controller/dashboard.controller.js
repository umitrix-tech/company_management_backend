const {
  getDashboardStatsService,
  getUpcomingTimelineService,
  getDashboardChartDataService
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

module.exports = {
  getDashboardDataController
};
