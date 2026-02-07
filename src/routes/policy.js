// routes/policy.routes.js
const router = require("express").Router();
const controller = require("../controller/policy.controller");
const validate = require("../validation");
const validation = require("../validation/policy.validation");

router.post("/", validate(validation.createPolicySchema), controller.createPolicy);
router.get("/", controller.getAllPolicies);
router.get("/:id", validate(validation.policyIdParam, "params"), controller.getPolicyById);
router.put(
  "/:id",
  validate(validation.policyIdParam, "params"),
  validate(validation.updatePolicySchema),
  controller.updatePolicyById
);
router.delete(
  "/:id",
  validate(validation.policyIdParam, "params"),
  controller.deletePolicyById
);

module.exports = router;
