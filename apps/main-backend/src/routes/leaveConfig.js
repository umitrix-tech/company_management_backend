const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
  listLeaveTypeSchema,
  idParamSchema,
} = require("../validation/leaveConfig.validation");

const {
  createLeaveTypeController,
  updateLeaveTypeController,
  deleteLeaveTypeController,
  listLeaveTypesController,
} = require("../controller/leaveConfig.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createLeaveTypeSchema),
  createLeaveTypeController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateLeaveTypeSchema),
  updateLeaveTypeController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema, "query"),
  deleteLeaveTypeController
);

// LIST
router.get(
  "/",
  auth,
  validate(listLeaveTypeSchema),
  listLeaveTypesController
);

module.exports = router;
