const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  applyPermissionSchema,
  updatePermissionStatusSchema,
  listPermissionRequestSchema,
  idParamSchema,
} = require("../validation/permissionRequest.validation");

const { setupPermissionConfigSchema } = require("../validation/permissionConfig.validation");

const {
  applyPermissionController,
  updatePermissionStatusController,
  listPermissionsController,
} = require("../controller/permissionRequest.controller");

const {
  getPermissionConfigController,
  setupPermissionConfigController,
  setupDeletePermissionConfigController,
} = require("../controller/permissionConfig.controller");

// APPLY
router.post(
  "/apply",
  auth,
  validate(applyPermissionSchema),
  applyPermissionController
);

// STATUS UPDATE
router.put(
  "/status",
  auth,
  validate(updatePermissionStatusSchema),
  updatePermissionStatusController
);

// LIST
router.get(
  "/",
  auth,
  validate(listPermissionRequestSchema),
  listPermissionsController
);

// --- CONFIGURATION ---

router.get(
  "/config",
  auth,
  getPermissionConfigController
);

router.post(
  "/config",
  auth,
  validate(setupPermissionConfigSchema),
  setupPermissionConfigController
);


router.delete(
  "/config",
  auth,
  validate(idParamSchema),
  setupDeletePermissionConfigController 
);
module.exports = router;
