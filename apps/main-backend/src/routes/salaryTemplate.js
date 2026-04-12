const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createSalaryTemplateSchema,
  updateSalaryTemplateSchema,
  listSalaryTemplateSchema,
  idParamSchema,
} = require("../validation/salaryTemplate.validation");

const {
  createSalaryTemplateController,
  updateSalaryTemplateController,
  deleteSalaryTemplateController,
  getSalaryTemplateController,
  listSalaryTemplatesController,
} = require("../controller/salaryTemplate.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createSalaryTemplateSchema),
  createSalaryTemplateController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateSalaryTemplateSchema),
  updateSalaryTemplateController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema, "query"),
  deleteSalaryTemplateController
);

// GET BY ID
router.get(
  "/single",
  auth,
  validate(idParamSchema, "query"),
  getSalaryTemplateController
);

// LIST
router.get(
  "/",
  auth,
  validate(listSalaryTemplateSchema),
  listSalaryTemplatesController
);

module.exports = router;
