const catchAsync = require("../utils/catchAsync");
const {
  createGalleryService,
  updateGalleryService,
  deleteGalleryService,
  getGalleryService,
  listGalleryService,
} = require("../service/gallery.service");

const createGalleryController = catchAsync(async (req, res) => {
  const data = await createGalleryService(req.body, req.user);
  res.status(201).json({ message: "Gallery item created successfully", data });
});

const updateGalleryController = catchAsync(async (req, res) => {
  const data = await updateGalleryService(req.body, req.user);
  res.status(200).json({ message: "Gallery item updated successfully", data });
});

const deleteGalleryController = catchAsync(async (req, res) => {
  await deleteGalleryService(req.query.id, req.user);
  res.status(200).json({ message: "Gallery item deleted successfully" });
});

const getGalleryController = catchAsync(async (req, res) => {
  const data = await getGalleryService(req.params.id, req.user);
  res.status(200).json({ data });
});

const listGalleryController = catchAsync(async (req, res) => {
  const data = await listGalleryService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createGalleryController,
  updateGalleryController,
  deleteGalleryController,
  getGalleryController,
  listGalleryController,
};