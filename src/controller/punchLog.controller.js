const catchAsync = require("../utils/catchAsync");
const {
  punchInService,
  punchOutService,
  listPunchLogService,
} = require("../service/punchLog.service");

const punchInController = catchAsync(async (req, res) => {
  const data = await punchInService(req.user, req.body);
  res.status(201).json({ message: "Punch In successful", data });
});

const punchOutController = catchAsync(async (req, res) => {
  const data = await punchOutService(req.user, req.body);
  res.status(200).json({ message: "Punch Out successful", data });
});

const listPunchLogController = catchAsync(async (req, res) => {
  const data = await listPunchLogService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
    punchInController,
    punchOutController,
    listPunchLogController
}


