const salaryService = require("../service/salary.service");
const catchAsync = require("../utils/catchAsync");

class SalaryController {
  // Templates
  createTemplate = catchAsync(async (req, res) => {
    const template = await salaryService.createTemplate(req.user.companyId, req.body);
    res.status(201).json({ status: "success", data: template });
  });

  getTemplates = catchAsync(async (req, res) => {
    const templates = await salaryService.getTemplates(req.user.companyId);
    res.status(200).json({ status: "success", data: templates });
  });

  updateTemplate = catchAsync(async (req, res) => {
    const template = await salaryService.updateTemplate(parseInt(req.params.id), req.body);
    res.status(200).json({ status: "success", data: template });
  });

  deleteTemplate = catchAsync(async (req, res) => {
    await salaryService.deleteTemplate(parseInt(req.params.id));
    res.status(204).send();
  });

  // Employee Salary
  assignSalary = catchAsync(async (req, res) => {
    const { userId } = req.body;
    const salary = await salaryService.assignSalaryToEmployee(req.user.companyId, userId, req.body);
    res.status(201).json({ status: "success", data: salary });
  });

  getSalaryHistory = catchAsync(async (req, res) => {
    const history = await salaryService.getEmployeeSalaryHistory(parseInt(req.params.userId));
    res.status(200).json({ status: "success", data: history });
  });

  // Loans
  createLoan = catchAsync(async (req, res) => {
    const { userId } = req.body;
    const loan = await salaryService.createLoan(req.user.companyId, userId, req.body);
    res.status(201).json({ status: "success", data: loan });
  });

  // Adjustments
  addAdjustment = catchAsync(async (req, res) => {
    const { userId } = req.body;
    const adjustment = await salaryService.addAdjustment(req.user.companyId, userId, req.body);
    res.status(201).json({ status: "success", data: adjustment });
  });

  // Salary Slip
  generateSlip = catchAsync(async (req, res) => {
    const { userId, month, year } = req.body;
    const slip = await salaryService.generateSalarySlip(req.user.companyId, userId, month, year);
    res.status(201).json({ status: "success", data: slip });
  });
}

module.exports = new SalaryController();
