const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createWorkHoursConfigController,
  updateWorkHoursConfigController,
  deleteWorkHoursConfigController,
  getWorkHoursConfigController,
  getWorkHoursConfigByIdController
} = require("../controller/workHoursConfig.controller");

const {
  createWorkHoursConfigSchema,
  updateWorkHoursConfigSchema,
  workHoursConfigIdSchema
} = require("../validation/workHoursConfig.validation.js");

// Create
router.post("/create", auth, validate(createWorkHoursConfigSchema), createWorkHoursConfigController);

// List (by company)
router.get("/list", auth, getWorkHoursConfigController);

// Get by id
router.get("/", auth, validate(workHoursConfigIdSchema), getWorkHoursConfigByIdController);

// Update
router.put("/", auth, validate(updateWorkHoursConfigSchema), updateWorkHoursConfigController);

// Delete
router.delete("/", auth, validate(workHoursConfigIdSchema), deleteWorkHoursConfigController);

module.exports = router;
