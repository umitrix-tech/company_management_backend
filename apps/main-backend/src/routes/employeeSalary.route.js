const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  setupEmployeeSalarySchema,
  listEmployeeSalarySchema,
  idParamSchema,
} = require("../validation/employeeSalary.validation");

const {
  setupEmployeeSalaryController,
  getEmployeeSalaryDetailsController,
  listSalaryHistoryController,
} = require("../controller/employeeSalary.controller");

// SETUP (Create/Update Salary + Tax Config + History)
router.post(
  "/setup",
  auth,
  validate(setupEmployeeSalarySchema),
  setupEmployeeSalaryController
);

// GET ACTIVE DETAILS (Salary + Tax Config)
router.get(
  "/details",
  auth,
  getEmployeeSalaryDetailsController
);

// LIST HISTORY
router.get(
  "/history",
  auth,
  validate(listEmployeeSalarySchema),
  listSalaryHistoryController
);

module.exports = router;
