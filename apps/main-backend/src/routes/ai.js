const express = require("express");
const router = express.Router();
const validate = require("../validation");
const auth = require("../middleware/auth.middleware");
const { processChatController } = require("../controller/ai.controller");
const { processChatValidation } = require("../validation/ai.validation");

router.post(
    '/',
    auth,
    validate(processChatValidation),
    processChatController
);

module.exports = router;
