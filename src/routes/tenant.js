

const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { tenantConfigController } = require("../controller/tenant.controller");


router.get("/config", tenantConfigController);

module.exports = router;