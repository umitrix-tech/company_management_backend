const express = require("express");
const router = express.Router();
const validate = require("../validation");
const {
  createCallSchema,
  updateCallStatusSchema,
  updateConnectTimeSchema,
  listCallSchema,
  createReviewSchema,
} = require("../validation/call.validation");
const {
  createCallController,
  updateCallStatusController,
  updateConnectTimeController,
  listLobbyController,
  listCompletedCallsController,
  addReviewController,
} = require("../controller/call.controller");

router.post("/", validate(createCallSchema), createCallController);
router.patch("/status/:id", validate(updateCallStatusSchema, "body"), updateCallStatusController);
router.patch("/connect/:id", validate(updateConnectTimeSchema, "body"), updateConnectTimeController);
router.get("/lobby", validate(listCallSchema, "query"), listLobbyController);
router.get("/history", validate(listCallSchema, "query"), listCompletedCallsController);
router.post("/review", validate(createReviewSchema, "body"), addReviewController);

module.exports = router;
