const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createPayrollCycleSchema,
  updatePayrollCycleSchema,
  listPayrollCycleSchema,
  idParamSchema,
} = require("../validation/payrollCycle.validation");

const {
  createPayrollCycleController,
  updatePayrollCycleController,
  deletePayrollCycleController,
  getPayrollCycleController,
  listPayrollCycleController,
} = require("../controller/payrollCycle.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createPayrollCycleSchema),
  createPayrollCycleController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updatePayrollCycleSchema),
  updatePayrollCycleController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema, "query"),
  deletePayrollCycleController
);

// GET BY ID
router.get(
  "/single",
  auth,
  validate(idParamSchema, "query"),
  getPayrollCycleController
);

// LIST
router.get(
  "/",
  auth,
  validate(listPayrollCycleSchema, "query"),
  listPayrollCycleController
);

module.exports = router;
