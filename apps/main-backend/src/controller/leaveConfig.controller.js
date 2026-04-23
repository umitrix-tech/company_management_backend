const catchAsync = require("../utils/catchAsync");
const {
  createLeaveTypeService,
  updateLeaveTypeService,
  deleteLeaveTypeService,
  listLeaveTypesService,
} = require("../service/leaveConfig.service");

const createLeaveTypeController = catchAsync(async (req, res) => {
  const data = await createLeaveTypeService(req.body, req.user);
  res.status(201).json({ message: "Leave type created successfully", data });
});

const updateLeaveTypeController = catchAsync(async (req, res) => {
  const data = await updateLeaveTypeService(req.body, req.user);
  res.status(200).json({ message: "Leave type updated successfully", data });
});

const deleteLeaveTypeController = catchAsync(async (req, res) => {
  const data = await deleteLeaveTypeService(req.query.id, req.user);
  res.status(200).json({ message: "Leave type deleted successfully", data });
});

const listLeaveTypesController = catchAsync(async (req, res) => {
  const data = await listLeaveTypesService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createLeaveTypeController,
  updateLeaveTypeController,
  deleteLeaveTypeController,
  listLeaveTypesController,
};
