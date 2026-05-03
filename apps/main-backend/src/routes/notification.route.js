const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  listNotificationSchema,
  idParamSchema,
} = require("../validation/notification.validation");

const {
  getNotificationListController,
  markNotificationAsReadController,
} = require("../controller/notification.controller");

router.get(
  "/",
  auth,
  validate(listNotificationSchema),
  getNotificationListController
);

router.put(
  "/read",
  auth,
  validate(idParamSchema),
  markNotificationAsReadController
);

module.exports = router;
