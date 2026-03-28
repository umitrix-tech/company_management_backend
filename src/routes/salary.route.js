const express = require("express");
const salaryController = require("../controller/salary.controller");
const auth = require("../middleware/auth.middleware");
const validate = require("../validation");
const {
  salaryTemplateSchema,
  assignSalarySchema,
  createLoanSchema,
  addAdjustmentSchema,
  generateSlipSchema,
  getLoansSchema,
  getLoanStatsSchema,
  loanActionSchema,
} = require("../validation/salary.validation");

const router = express.Router();

router.use(auth);

router.route("/templates")
  .post(validate(salaryTemplateSchema), salaryController.createTemplate)
  .get(salaryController.getTemplates);

router.route("/templates/:id")
  .put(validate(salaryTemplateSchema), salaryController.updateTemplate)
  .delete(salaryController.deleteTemplate);

router.route("/assign")
  .post(validate(assignSalarySchema), salaryController.assignSalary);

router.route("/history/:userId")
  .get(salaryController.getSalaryHistory);

router.route("/loans")
  .post(validate(createLoanSchema), salaryController.createLoan)
  .get(validate(getLoansSchema), salaryController.getLoans);

router.post("/loans/:id/action", validate(loanActionSchema), salaryController.handleLoanAction);

router.get("/loan-stats", validate(getLoanStatsSchema), salaryController.getLoanStats);

router.route("/adjustments")
  .post(validate(addAdjustmentSchema), salaryController.addAdjustment);

router.route("/slips/generate")
  .post(validate(generateSlipSchema), salaryController.generateSlip);

module.exports = router;
