const catchAsync = require("../utils/catchAsync");
const {
  applyPermissionService,
  updatePermissionStatusService,
  listPermissionsService,
} = require("../service/permissionRequest.service");

const applyPermissionController = catchAsync(async (req, res) => {
  const data = await applyPermissionService(req.body, req.user);
  res.status(201).json({ message: "Permission applied successfully", data });
});

const updatePermissionStatusController = catchAsync(async (req, res) => {
  const data = await updatePermissionStatusService(req.body, req.user);
  res.status(200).json({ message: `Permission ${req.body.status.toLowerCase()} successfully`, data });
});

const listPermissionsController = catchAsync(async (req, res) => {
  const data = await listPermissionsService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  applyPermissionController,
  updatePermissionStatusController,
  listPermissionsController,
};
