const express = require("express");
const router = express.Router();

router.use("/tenant", require("./tenant"));
router.use("/auth", require("./auth"));
router.use("/company", require("./company"));
router.use("/user", require("./user"));
router.use('/role', require('./role'));
router.use('/config', require('./configuration'));
router.use('/particularDateConfig', require('./particularDateConfig'));
router.use('/punchLog', require('./punchLog.route'));
router.use('/timeline', require('./timeLineConfig'));
router.use('/policy', require('./policy'));
router.use("/media", require("./media"));
router.use('/notes', require('./notes'));
router.use('/gallery', require('./gallery'));
router.use('/plan-history', require('./planHistory'));
router.use('/subscription', require('./subscription'));
router.use('/hierarchy', require('./hierarchy'));

router.use("/ai", require("./ai"));
router.use("/salary-template", require("./salaryTemplate"));
router.use("/employee-salary", require("./employeeSalary.route"));
router.use("/call", require("./call.route"));
router.use("/dashboard", require("./dashboard.route"));
router.use("/tax-slab", require("./taxSlab"));

router.use("/leave-config", require("./leaveConfig"));
router.use("/leave", require("./leaveRequest"));
router.use("/permission", require("./permissionRequest"));

module.exports = router;
