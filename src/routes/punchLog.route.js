const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  punchInController,
  punchOutController,
  listPunchLogController,
  listEmployeeAttendanceController,
  employeeAttendanceDashboardController,
} = require("../controller/punchLog.controller");

const {
  punchInSchema,
  punchOutSchema,
  listPunchLogSchema,
  listEmployeeAttendanceSchema,
  employeeAttendanceDashboardSchema,
} = require("../validation/punchLog.validation");

// PUNCH IN
router.post(
  "/punch-in",
  auth,
  validate(punchInSchema),
  punchInController
);

// PUNCH OUT
router.post(
  "/punch-out",
  auth,
  validate(punchOutSchema),
  punchOutController
);

// LIST
router.get(
  "/",
  auth,
  validate(listPunchLogSchema),
  listPunchLogController
);

router.get(
  "/employee-attendance",
  auth,
  validate(listEmployeeAttendanceSchema),
  listEmployeeAttendanceController
);


router.get(
  "/employee-attendance-dashboard",
  auth,
  validate(employeeAttendanceDashboardSchema),
  employeeAttendanceDashboardController
);

module.exports = router;
