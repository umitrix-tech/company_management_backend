const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createTimeLineSchema,
  updateTimeLineSchema,
  idParamSchema,
  listTimeLineSchema,
} = require("../validation/timeLineConfig.validation");

const {
  createTimeLinController,
  deleteTimeLinController,
  getTimeLinController,
  listTimeLinController,
  updateTimeLinController
} = require("../controller/timeLineConfig.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createTimeLineSchema),
  createTimeLinController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateTimeLineSchema),
  updateTimeLinController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteTimeLinController
);

// GET BY ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema),
  getTimeLinController
);

// LIST
router.get(
  "/",
  auth,
  validate(listTimeLineSchema),
  listTimeLinController
);

module.exports = router;
