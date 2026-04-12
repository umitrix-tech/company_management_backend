const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createEmployeeTaxConfigSchema,
  updateEmployeeTaxConfigSchema,
  listEmployeeTaxConfigSchema,
  idParamSchema,
} = require("../validation/employeeTaxConfig.validation");

const {
  createEmployeeTaxConfigController,
  updateEmployeeTaxConfigController,
  deleteEmployeeTaxConfigController,
  getEmployeeTaxConfigController,
  listEmployeeTaxConfigController,
} = require("../controller/employeeTaxConfig.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createEmployeeTaxConfigSchema),
  createEmployeeTaxConfigController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateEmployeeTaxConfigSchema),
  updateEmployeeTaxConfigController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteEmployeeTaxConfigController
);

// GET BY ID
router.get(
  "/single",
  auth,
  validate(idParamSchema),
  getEmployeeTaxConfigController
);

// LIST
router.get(
  "/",
  auth,
  validate(listEmployeeTaxConfigSchema),
  listEmployeeTaxConfigController
);

module.exports = router;
