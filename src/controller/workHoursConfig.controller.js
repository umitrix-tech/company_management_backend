const catchAsync = require("../utils/catchAsync");

const {
  createWorkHoursConfigService,
  updateWorkHoursConfigService,
  deleteWorkHoursConfigService,
  getWorkHoursConfigService,
  getWorkHoursConfigByIdService
} = require("../service/workHoursConfig.service");

const createWorkHoursConfigController = catchAsync(async (req, res) => {
  const config = await createWorkHoursConfigService(req.body, req.user);
  res.status(201).json({
    message: "Work hours configuration created successfully",
    data: config
  });
});

const getWorkHoursConfigController = catchAsync(async (req, res) => {
  const configs = await getWorkHoursConfigService(req.user);
  res.status(200).json({
    data: configs,
    message:"configuration retrieved successfully"
  });
});

const getWorkHoursConfigByIdController = catchAsync(async (req, res) => {
  const config = await getWorkHoursConfigByIdService(req.query.id, req.user);
  res.status(200).json({
    data: config
  });
});

const updateWorkHoursConfigController = catchAsync(async (req, res) => {
  const config = await updateWorkHoursConfigService(req.body, req.user);
  res.status(200).json({
    message: "Work hours configuration updated successfully",
    data: config
  });
});

const deleteWorkHoursConfigController = catchAsync(async (req, res) => {
  await deleteWorkHoursConfigService(req.query.id, req.user);
  res.status(200).json({
    message: "Work hours configuration deleted successfully"
  });
});

module.exports = {
  createWorkHoursConfigController,
  updateWorkHoursConfigController,
  deleteWorkHoursConfigController,
  getWorkHoursConfigController,
  getWorkHoursConfigByIdController
};
