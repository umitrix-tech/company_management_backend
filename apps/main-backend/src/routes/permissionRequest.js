const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  applyPermissionSchema,
  updatePermissionStatusSchema,
  updatePermissionSchema,
  listPermissionRequestSchema,
  idParamSchema,
} = require("../validation/permissionRequest.validation");

const { setupPermissionConfigSchema } = require("../validation/permissionConfig.validation");

const {
  applyPermissionController,
  updatePermissionController,
  deletePermissionController,
  getPermissionByIdController,
  updatePermissionStatusController,
  listPermissionsController,
  getPermissionSummaryController,
} = require("../controller/permissionRequest.controller");

const {
  getPermissionConfigController,
  setupPermissionConfigController,
  setupDeletePermissionConfigController,
} = require("../controller/permissionConfig.controller");

// APPLY
router.post(
  "/create",
  auth,
  validate(applyPermissionSchema),
  applyPermissionController
);


// LIST
router.get(
  "/",
  auth,
  validate(listPermissionRequestSchema),
  listPermissionsController
);
8

// UPDATE
router.put(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  validate(updatePermissionSchema),
  updatePermissionController
);

// DELETE / CANCEL
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deletePermissionController
);

// GET BY ID
router.get(
  "/detail/:id",
  auth,
  validate(idParamSchema, "params"),
  getPermissionByIdController
);

// STATUS UPDATE
router.put(
  "/status",
  auth,
  validate(updatePermissionStatusSchema),
  updatePermissionStatusController
);


// SUMMARY
router.get(
  "/summary",
  auth,
  getPermissionSummaryController
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
