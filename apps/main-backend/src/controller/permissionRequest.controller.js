const catchAsync = require("../utils/catchAsync");
const {
  applyPermissionService,
  updatePermissionService,
  deletePermissionService,
  getPermissionByIdService,
  updatePermissionStatusService,
  listPermissionsService,
  getPermissionSummaryService,
} = require("../service/permissionRequest.service");

const applyPermissionController = catchAsync(async (req, res) => {
  const data = await applyPermissionService(req.body, req.user);
  res.status(201).json({ message: "Permission applied successfully", data });
});

const updatePermissionController = catchAsync(async (req, res) => {
  const data = await updatePermissionService(req.body, req.user);
  res.status(200).json({ message: "Permission request updated successfully", data });
});

const deletePermissionController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const data = await deletePermissionService(id, req.user);
  res.status(200).json({ message: "Permission request cancelled successfully", data });
});

const getPermissionByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getPermissionByIdService(id, req.user);
  res.status(200).json({ data });
});

const updatePermissionStatusController = catchAsync(async (req, res) => {
  const data = await updatePermissionStatusService(req.body, req.user);
  res.status(200).json({ message: `Permission ${req.body.status.toLowerCase()} successfully`, data });
});

const listPermissionsController = catchAsync(async (req, res) => {
  const data = await listPermissionsService(req.query, req.user);
  res.status(200).json(data);
});

const getPermissionSummaryController = catchAsync(async (req, res) => {
  const data = await getPermissionSummaryService(req.query.userId, req.user);
  res.status(200).json({ data });
});

module.exports = {
  applyPermissionController,
  updatePermissionController,
  deletePermissionController,
  getPermissionByIdController,
  updatePermissionStatusController,
  listPermissionsController,
  getPermissionSummaryController,
};
