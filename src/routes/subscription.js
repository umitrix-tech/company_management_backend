const express = require("express");
const router = express.Router();
const validate = require("../validation");
const auth = require("../middleware/auth.middleware");
const permissionAuth = require("../middleware/permissionMiddleware");
const { moduleAccess } = require("../utils/constData");

const {
  createSubscriptionController,
  listSubscriptionController
} = require("../controller/subscription.controller");

const {
  createSubscriptionSchema,
  listSubscriptionSchema
} = require("../validation/subscription.validation");

router.post(
  "/",
  auth,
  permissionAuth(moduleAccess.SUBSCRIPTION.CREATE),
  validate(createSubscriptionSchema),
  createSubscriptionController
);

router.get(
  "/",
  auth,
  permissionAuth(moduleAccess.SUBSCRIPTION.VIEW),
  validate(listSubscriptionSchema),
  listSubscriptionController
);

module.exports = router;
