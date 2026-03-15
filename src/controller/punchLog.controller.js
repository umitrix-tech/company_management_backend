const catchAsync = require("../utils/catchAsync");
const {
  punchInService,
  punchOutService,
  listPunchLogService,
  listEmployeeAttendanceService,
  employeeAttendanceDashboardService,
  downloadPunchLogExcelService,
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

const listEmployeeAttendanceController = catchAsync(async (req, res) => {
  const data = await listEmployeeAttendanceService(req.query, req.user);
  res.status(200).json(data);
});

const employeeAttendanceDashboardController = catchAsync(async (req, res) => {
  const data = await employeeAttendanceDashboardService(req.query, req.user);
  res.status(200).json({
    message: "Employee attendance dashboard fetched successfully",
    data
  });

});

const downloadPunchLogExcelController = catchAsync(async (req, res) => {
  const buffer = await downloadPunchLogExcelService(req.query, req.user);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=punch_logs_${req.query.userId || req.user.id}.xlsx`
  );

  res.status(200).send(buffer);
});

module.exports = {
  punchInController,
  punchOutController,
  listPunchLogController,
  listEmployeeAttendanceController,
  employeeAttendanceDashboardController,
  downloadPunchLogExcelController,
};


