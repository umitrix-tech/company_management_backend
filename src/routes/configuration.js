const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createWorkHoursConfigController,
  updateWorkHoursConfigController,
  deleteWorkHoursConfigController,
  getWorkHoursConfigController,
  getWorkHoursConfigByIdController,
  getOwnWorkingHoursConfigController
} = require("../controller/workHoursConfig.controller");

const {
  createWorkHoursConfigSchema,
  updateWorkHoursConfigSchema,
  workHoursConfigIdSchema
} = require("../validation/workHoursConfig.validation.js");

router.post("/create", auth, validate(createWorkHoursConfigSchema), createWorkHoursConfigController);
router.get("/list", auth, getWorkHoursConfigController);
router.get("/", auth, validate(workHoursConfigIdSchema), getWorkHoursConfigByIdController);
router.put("/", auth, validate(updateWorkHoursConfigSchema), updateWorkHoursConfigController);
router.delete("/", auth, validate(workHoursConfigIdSchema), deleteWorkHoursConfigController);


router.get('/own-config', auth, getOwnWorkingHoursConfigController);

module.exports = router;
