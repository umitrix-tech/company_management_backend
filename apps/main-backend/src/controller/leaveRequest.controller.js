const catchAsync = require("../utils/catchAsync");
const {
  applyLeaveService,
  approveLeaveService,
  listLeaveRequestsService,
  getLeaveBalanceService,
} = require("../service/leaveRequest.service");

const applyLeaveController = catchAsync(async (req, res) => {
  const data = await applyLeaveService(req.body, req.user);
  res.status(201).json({ message: "Leave applied successfully", data });
});

const approveLeaveController = catchAsync(async (req, res) => {
  const data = await approveLeaveService(req.body, req.user);
  res.status(200).json({ message: `Leave ${req.body.status.toLowerCase()} successfully`, data });
});

const listLeaveRequestsController = catchAsync(async (req, res) => {
  const data = await listLeaveRequestsService(req.query, req.user);
  res.status(200).json(data);
});

const getLeaveBalanceController = catchAsync(async (req, res) => {
  const data = await getLeaveBalanceService(req.query.userId, req.user);
  res.status(200).json({ data });
});

module.exports = {
  applyLeaveController,
  approveLeaveController,
  listLeaveRequestsController,
  getLeaveBalanceController,
};
