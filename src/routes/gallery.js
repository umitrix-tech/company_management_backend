const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../validation");

const {
  createGallerySchema,
  updateGallerySchema,
  listGallerySchema,
  idParamSchema,
} = require("../validation/gallery.validation");

const {
  createGalleryController,
  updateGalleryController,
  deleteGalleryController,
  getGalleryController,
  listGalleryController,
} = require("../controller/gallery.controller");

// CREATE
router.post(
  "/",
  auth,
  validate(createGallerySchema),
  createGalleryController
);

// UPDATE
router.put(
  "/",
  auth,
  validate(updateGallerySchema),
  updateGalleryController
);

// DELETE
router.delete(
  "/",
  auth,
  validate(idParamSchema),
  deleteGalleryController
);

// GET BY ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema),
  getGalleryController
);

// LIST
router.get(
  "/",
  auth,
  validate(listGallerySchema),
  listGalleryController
);

module.exports = router;