const catchAsync = require("../utils/catchAsync");
const {
  getNotificationListService,
  markNotificationAsReadService,
} = require("../service/notification.service");

const getNotificationListController = catchAsync(async (req, res) => {
  const result = await getNotificationListService(req.query, req.user);
  res.status(200).json(result);
});

const markNotificationAsReadController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await markNotificationAsReadService(id, req.user);
  res.status(200).json({ message: "Notification marked as read", data });
});

module.exports = {
  getNotificationListController,
  markNotificationAsReadController,
};
