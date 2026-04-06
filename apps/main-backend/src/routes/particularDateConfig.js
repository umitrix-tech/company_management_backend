const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createParticularDateSchema,
  updateParticularDateSchema,
  idParamSchema,
  listParticularDateSchema,
} = require("../validation/particularDateConfig.validation");

const {
  createParticularDateController,
  updateParticularDateController,
  deleteParticularDateController,
  getParticularDateController,
  listParticularDateController,
} = require("../controller/particularDateConfig.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createParticularDateSchema),
  createParticularDateController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateParticularDateSchema),
  updateParticularDateController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteParticularDateController
);

// GET BY ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema),
  getParticularDateController
);

// LIST
router.get(
  "/",
  auth,
  validate(listParticularDateSchema),
  listParticularDateController
);

module.exports = router;
