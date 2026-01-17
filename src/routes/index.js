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
module.exports = router;
