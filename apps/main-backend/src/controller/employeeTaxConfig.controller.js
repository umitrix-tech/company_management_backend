const catchAsync = require("../utils/catchAsync");
const {
  createEmployeeTaxConfigService,
  updateEmployeeTaxConfigService,
  deleteEmployeeTaxConfigService,
  getEmployeeTaxConfigService,
  listEmployeeTaxConfigService,
} = require("../service/employeeTaxConfig.service");

const createEmployeeTaxConfigController = catchAsync(async (req, res) => {
  const data = await createEmployeeTaxConfigService(req.body, req.user);
  res.status(201).json({ message: "Employee tax config created successfully", data });
});

const updateEmployeeTaxConfigController = catchAsync(async (req, res) => {
  const data = await updateEmployeeTaxConfigService(req.body, req.user);
  res.status(200).json({ message: "Employee tax config updated successfully", data });
});

const deleteEmployeeTaxConfigController = catchAsync(async (req, res) => {
  const data = await deleteEmployeeTaxConfigService(req.query.id, req.user);
  res.status(200).json({ message: "Employee tax config deleted successfully", data });
});

const getEmployeeTaxConfigController = catchAsync(async (req, res) => {
  const data = await getEmployeeTaxConfigService(req.query.id, req.user);
  res.status(200).json({ data });
});

const listEmployeeTaxConfigController = catchAsync(async (req, res) => {
  const data = await listEmployeeTaxConfigService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createEmployeeTaxConfigController,
  updateEmployeeTaxConfigController,
  deleteEmployeeTaxConfigController,
  getEmployeeTaxConfigController,
  listEmployeeTaxConfigController,
};
