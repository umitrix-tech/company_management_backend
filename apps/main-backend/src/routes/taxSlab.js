const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createTaxSlabSchema,
  updateTaxSlabSchema,
  listTaxSlabSchema,
  idParamSchema,
} = require("../validation/taxSlab.validation");

const {
  createTaxSlabController,
  updateTaxSlabController,
  deleteTaxSlabController,
  getTaxSlabController,
  listTaxSlabController,
} = require("../controller/taxSlab.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createTaxSlabSchema),
  createTaxSlabController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateTaxSlabSchema),
  updateTaxSlabController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema, "query"),
  deleteTaxSlabController
);

// GET BY ID
router.get(
  "/single",
  auth,
  validate(idParamSchema),
  getTaxSlabController
);

// LIST
router.get(
  "/",
  auth,
  validate(listTaxSlabSchema),
  listTaxSlabController
);

module.exports = router;
