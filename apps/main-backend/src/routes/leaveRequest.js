const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  applyLeaveSchema,
  approveLeaveSchema,
  listLeaveRequestSchema,
  idParamSchema,
} = require("../validation/leaveRequest.validation");

const {
  applyLeaveController,
  approveLeaveController,
  listLeaveRequestsController,
  getLeaveBalanceController,
} = require("../controller/leaveRequest.controller");

// APPLY
router.post(
  "/apply",
  auth,
  validate(applyLeaveSchema),
  applyLeaveController
);

// APPROVE / REJECT
router.put(
  "/status",
  auth,
  validate(approveLeaveSchema),
  approveLeaveController
);

// BALANCE
router.get(
  "/balance",
  auth,
  getLeaveBalanceController
);

// LIST
router.get(
  "/",
  auth,
  validate(listLeaveRequestSchema),
  listLeaveRequestsController
);

module.exports = router;
