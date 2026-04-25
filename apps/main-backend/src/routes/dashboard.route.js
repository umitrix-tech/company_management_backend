const express = require("express");
const router = express.Router();
const { 
  getDashboardDataController,
  getLeavePermissionDashboardController,
  getEmployeeLeavePermissionListController
} = require("../controller/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getDashboardDataController);
router.get("/leave-permission", authMiddleware, getLeavePermissionDashboardController);
router.get("/employee-leave-permission", authMiddleware, getEmployeeLeavePermissionListController);

module.exports = router;
