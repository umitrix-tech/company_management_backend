const catchAsync = require("../utils/catchAsync");
const {
  createPayrollCycleService,
  updatePayrollCycleService,
  deletePayrollCycleService,
  getPayrollCycleService,
  listPayrollCycleService,
} = require("../service/payrollCycle.service");

const createPayrollCycleController = catchAsync(async (req, res) => {
  const data = await createPayrollCycleService(req.body, req.user);
  res.status(201).json({ message: "Payroll cycle created successfully", data });
});

const updatePayrollCycleController = catchAsync(async (req, res) => {
  const data = await updatePayrollCycleService(req.body, req.user);
  res.status(200).json({ message: "Payroll cycle updated successfully", data });
});

const deletePayrollCycleController = catchAsync(async (req, res) => {
  const data = await deletePayrollCycleService(req.query.id, req.user);
  res.status(200).json({ message: "Payroll cycle deleted successfully", data });
});

const getPayrollCycleController = catchAsync(async (req, res) => {
  const data = await getPayrollCycleService(req.query.id, req.user);
  res.status(200).json({ data });
});

const listPayrollCycleController = catchAsync(async (req, res) => {
  const data = await listPayrollCycleService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createPayrollCycleController,
  updatePayrollCycleController,
  deletePayrollCycleController,
  getPayrollCycleController,
  listPayrollCycleController,
};
