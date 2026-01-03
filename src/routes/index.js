const express = require("express");
const router = express.Router();

router.use("/tenant", require("./tenant"));
router.use("/auth", require("./auth"));
router.use("/company", require("./company"));
router.use("/user", require("./user"));
router.use('/role', require('./role'));
module.exports = router;
