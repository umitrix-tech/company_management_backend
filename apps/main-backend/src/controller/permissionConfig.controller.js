const catchAsync = require("../utils/catchAsync");
const {
  getPermissionConfigService,
  setupPermissionConfigService,
} = require("../service/permissionConfig.service");

const getPermissionConfigController = catchAsync(async (req, res) => {
  const data = await getPermissionConfigService(req.user);
  res.status(200).json({ data });
});

const setupPermissionConfigController = catchAsync(async (req, res) => {
  const data = await setupPermissionConfigService(req.body, req.user);
  res.status(200).json({ message: "Permission configuration updated successfully", data });
});

module.exports = {
  getPermissionConfigController,
  setupPermissionConfigController,
};
