const catchAsync = require("../utils/catchAsync");
const {
  setupEmployeeSalaryService,
  getEmployeeSalaryDetailsService,
  listSalaryHistoryService,
} = require("../service/employeeSalary.service");

const setupEmployeeSalaryController = catchAsync(async (req, res) => {
  const data = await setupEmployeeSalaryService(req.body, req.user);
  res.status(201).json({ message: "Employee salary setup successful", data });
});

const getEmployeeSalaryDetailsController = catchAsync(async (req, res) => {
  const data = await getEmployeeSalaryDetailsService(req.query.userId, req.user);
  res.status(200).json({ data });
});

const listSalaryHistoryController = catchAsync(async (req, res) => {
  const data = await listSalaryHistoryService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  setupEmployeeSalaryController,
  getEmployeeSalaryDetailsController,
  listSalaryHistoryController,
};
