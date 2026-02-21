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
router.use('/timeline',require('./timeLineConfig'));
router.use('/policy',require('./policy'));
router.use("/media", require("./media"));
router.use('/notes', require('./notes'));
router.use('/gallery', require('./gallery'));

module.exports = router;
