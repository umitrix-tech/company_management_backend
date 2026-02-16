const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createNotesSchema,
  updateNotesSchema,
  listNotesSchema,
  idParamSchema,
} = require("../validation/notes.validation");

const {
  createNotesController,
  updateNotesController,
  deleteNotesController,
  getNotesController,
  listNotesController,
} = require("../controller/notes.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createNotesSchema),
  createNotesController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateNotesSchema),
  updateNotesController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteNotesController
);

// GET BY ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema),
  getNotesController
);

// LIST
router.get(
  "/",
  auth,
  validate(listNotesSchema),
  listNotesController
);

module.exports = router;