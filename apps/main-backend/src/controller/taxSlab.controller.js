const catchAsync = require("../utils/catchAsync");
const {
  createTaxSlabService,
  updateTaxSlabService,
  deleteTaxSlabService,
  getTaxSlabService,
  listTaxSlabService,
} = require("../service/taxSlab.service");

const createTaxSlabController = catchAsync(async (req, res) => {
  const data = await createTaxSlabService(req.body, req.user, res);
  res.status(201).json({ message: "Tax slab created successfully", data });
});

const updateTaxSlabController = catchAsync(async (req, res) => {
  const data = await updateTaxSlabService(req.body, req.user);
  res.status(200).json({ message: "Tax slab updated successfully", data });
});

const deleteTaxSlabController = catchAsync(async (req, res) => {
  const data = await deleteTaxSlabService(req.query.id, req.user);
  res.status(200).json({ message: "Tax slab deleted successfully", data });
});

const getTaxSlabController = catchAsync(async (req, res) => {
  const data = await getTaxSlabService(req.query.id, req.user);
  res.status(200).json({ data });
});

const listTaxSlabController = catchAsync(async (req, res) => {
  const data = await listTaxSlabService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createTaxSlabController,
  updateTaxSlabController,
  deleteTaxSlabController,
  getTaxSlabController,
  listTaxSlabController,
};
