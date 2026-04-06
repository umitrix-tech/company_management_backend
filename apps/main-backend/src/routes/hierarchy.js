const express = require("express");
const router = express.Router();
const validate = require("../validation");
const auth = require("../middleware/auth.middleware");
const { getHierarchyController, assignManagerController, removeManagerController } = require("../controller/hierarchy.controller");
const { assignManagerValidation, removeManagerValidation } = require("../validation/hierarchy.validation");

router.get(
    '/',
    auth,
    getHierarchyController
);

router.post(
    '/assign',
    auth,
    validate(assignManagerValidation),
    assignManagerController
);

router.post(
    '/remove',
    auth,
    validate(removeManagerValidation),
    removeManagerController
);

module.exports = router;
