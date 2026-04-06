const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createPolicySchema,
  updatePolicySchema,
  idParamSchema,
  listPolicySchema,
} = require("../validation/policy.validation");

const {
  createPolicyController,
  updatePolicyController,
  deletePolicyController,
  getPolicyController,
  listPolicyController,
} = require("../controller/policy.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createPolicySchema),
  createPolicyController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updatePolicySchema),
  updatePolicyController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deletePolicyController
);

// GET BY ID
router.get(
  "/single",
  auth,
  validate(idParamSchema),
  getPolicyController
);

// LIST
router.get(
  "/",
  auth,
  validate(listPolicySchema),
  listPolicyController
);

module.exports = router;
