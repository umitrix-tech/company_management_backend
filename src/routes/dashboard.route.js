const express = require("express");
const router = express.Router();
const { getDashboardDataController } = require("../controller/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getDashboardDataController);

module.exports = router;
