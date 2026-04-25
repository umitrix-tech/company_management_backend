const catchAsync = require("../utils/catchAsync");
const {
  applyLeaveService,
  updateLeaveService,
  deleteLeaveService,
  getLeaveByIdService,
  approveLeaveService,
  listLeaveRequestsService,
  getLeaveSummaryService,
} = require("../service/leaveRequest.service");

const applyLeaveController = catchAsync(async (req, res) => {
  const data = await applyLeaveService(req.body, req.user);
  res.status(201).json({ message: "Leave applied successfully", data });
});

const updateLeaveController = catchAsync(async (req, res) => {
  const data = await updateLeaveService(req.body, req.user);
  res.status(200).json({ message: "Leave request updated successfully", data });
});

const deleteLeaveController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const data = await deleteLeaveService(id, req.user);
  res.status(200).json({ message: "Leave request cancelled successfully", data });
});

const getLeaveByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getLeaveByIdService(id, req.user);
  res.status(200).json({ data });
});

const approveLeaveController = catchAsync(async (req, res) => {
  const data = await approveLeaveService(req.body, req.user);
  res.status(200).json({ message: `Leave ${req.body.status.toLowerCase()} successfully`, data });
});

const listLeaveRequestsController = catchAsync(async (req, res) => {
  const data = await listLeaveRequestsService(req.query, req.user);
  res.status(200).json(data);
});

const getLeaveSummaryController = catchAsync(async (req, res) => {
  const data = await getLeaveSummaryService(req.query.userId, req.user);
  res.status(200).json({ data });
});

module.exports = {
  applyLeaveController,
  updateLeaveController,
  deleteLeaveController,
  getLeaveByIdController,
  approveLeaveController,
  listLeaveRequestsController,
  getLeaveSummaryController,
};
