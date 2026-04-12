const catchAsync = require("../utils/catchAsync");
const {
  createSalaryTemplateService,
  updateSalaryTemplateService,
  deleteSalaryTemplateService,
  getSalaryTemplateService,
  listSalaryTemplatesService,
} = require("../service/salaryTemplate.service");

const createSalaryTemplateController = catchAsync(async (req, res) => {
  const data = await createSalaryTemplateService(req.body, req.user);
  res.status(201).json({ message: "Salary template created successfully", data });
});

const updateSalaryTemplateController = catchAsync(async (req, res) => {
  const data = await updateSalaryTemplateService(req.body, req.user);
  res.status(200).json({ message: "Salary template updated successfully", data });
});

const deleteSalaryTemplateController = catchAsync(async (req, res) => {
  const data = await deleteSalaryTemplateService(req.query.id, req.user);
  res.status(200).json({ message: "Salary template deleted successfully", data });
});

const getSalaryTemplateController = catchAsync(async (req, res) => {
  const data = await getSalaryTemplateService(req.query.id, req.user);
  res.status(200).json({ data });
});

const listSalaryTemplatesController = catchAsync(async (req, res) => {
  const data = await listSalaryTemplatesService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createSalaryTemplateController,
  updateSalaryTemplateController,
  deleteSalaryTemplateController,
  getSalaryTemplateController,
  listSalaryTemplatesController,
};
