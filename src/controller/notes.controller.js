const catchAsync = require("../utils/catchAsync");
const {
  createNotesService,
  updateNotesService,
  deleteNotesService,
  getNotesService,
  listNotesService,
} = require("../service/notes.service");

const createNotesController = catchAsync(async (req, res) => {
  const data = await createNotesService(req.body, req.user);
  res.status(201).json({ message: "Notes created successfully", data });
});

const updateNotesController = catchAsync(async (req, res) => {
  const data = await updateNotesService(req.body, req.user);
  res.status(200).json({ message: "Notes updated successfully", data });
});

const deleteNotesController = catchAsync(async (req, res) => {
  const data = await deleteNotesService(req.query.id, req.user);
  res.status(200).json({ message: "Notes deleted successfully",data });
});

const getNotesController = catchAsync(async (req, res) => {
  const data = await getNotesService(req.query.id, req.user);
  res.status(200).json({ data });
});

const listNotesController = catchAsync(async (req, res) => {
  const data = await listNotesService(req.query, req.user);
  res.status(200).json(data);
});

module.exports = {
  createNotesController,
  updateNotesController,
  deleteNotesController,
  getNotesController,
  listNotesController,
};