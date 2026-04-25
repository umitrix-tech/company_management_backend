const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  applyLeaveSchema,
  approveLeaveSchema,
  updateLeaveSchema,
  listLeaveRequestSchema,
  idParamSchema,
} = require("../validation/leaveRequest.validation");

const {
  applyLeaveController,
  updateLeaveController,
  deleteLeaveController,
  getLeaveByIdController,
  approveLeaveController,
  listLeaveRequestsController,
  getLeaveSummaryController,
} = require("../controller/leaveRequest.controller");

// APPLY
router.post(
  "/create",
  auth,
  validate(applyLeaveSchema),
  applyLeaveController
);

// LIST
router.get(
  "/",
  auth,
  validate(listLeaveRequestSchema),
  listLeaveRequestsController
);


// DELETE / CANCEL
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteLeaveController
);


// UPDATE
router.put(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  validate(updateLeaveSchema),
  updateLeaveController
);


// GET BY ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  getLeaveByIdController
);

// APPROVE / REJECT
router.put(
  "/status",
  auth,
  validate(approveLeaveSchema),
  approveLeaveController
);


// SUMMARY
router.get(
  "/summary",
  auth,
  getLeaveSummaryController
);

module.exports = router;
