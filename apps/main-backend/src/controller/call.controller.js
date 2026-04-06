const catchAsync = require("../utils/catchAsync");
const {
  createCallService,
  updateCallStatusService,
  updateConnectTimeService,
  listLobbyService,
  listCompletedCallsService,
  addReviewService,
} = require("../service/call.service");

const createCallController = catchAsync(async (req, res) => {
  const data = await createCallService(req.body, req.user);
  res.status(201).json({ message: "Call initiated successfully", data });
});

const updateCallStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateCallStatusService(id, req.body, req.user);
  res.status(200).json({ message: "Call status updated successfully", data });
});

const updateConnectTimeController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateConnectTimeService(id, req.body, req.user);
  res.status(200).json({ message: "Call connection recorded successfully", data });
});

const listLobbyController = catchAsync(async (req, res) => {
  const data = await listLobbyService(req.query, req.user);
  res.status(200).json(data);
});

const listCompletedCallsController = catchAsync(async (req, res) => {
  const data = await listCompletedCallsService(req.query, req.user);
  res.status(200).json(data);
});

const addReviewController = catchAsync(async (req, res) => {
  const data = await addReviewService(req.body, req.user);
  res.status(201).json({ message: "Review added successfully", data });
});

module.exports = {
  createCallController,
  updateCallStatusController,
  updateConnectTimeController,
  listLobbyController,
  listCompletedCallsController,
  addReviewController,
};
