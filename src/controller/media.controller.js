const catchAsync = require("../utils/catchAsync");
const {
  uploadMediaService,
  getMediaService,
  getMediaListService,
  deleteMediaService,
  updateMediaService,
  uploadMultiMediaService,
} = require("../service/media.service");

/**
 * UPLOAD
 */
exports.uploadMedia = catchAsync(async (req, res) => {
  const media = await uploadMediaService(req.file, req.user, req.body);
  res.status(201).json({
    status: "success",
    data: media,
  });
});


exports.uploadMultiMedia = catchAsync(async (req, res) => {
  const media = await uploadMultiMediaService(req.files, req.user, req.body);

  res.status(201).json({
    status: "success",
    results: media.length,
    data: media,
  });
});


/**
 * 
 * GET BY ID
 */
exports.getMedia = catchAsync(async (req, res) => {
  const media = await getMediaService(req.params.id);

  res.json({
    status: "success",
    data: media,
  });
});

/**
 * LIST
 */
exports.getMediaList = catchAsync(async (req, res) => {
  const result = await getMediaListService(req.query);

  res.json({
    status: "success",
    ...result,
  });
});

/**
 * UPDATE
 */
exports.updateMedia = catchAsync(async (req, res) => {
  const media = await updateMediaService(
    req.params.id,
    req.body,
    req.user
  );

  res.json({
    status: "success",
    data: media,
  });
});

/**
 * DELETE
 */
exports.deleteMedia = catchAsync(async (req, res) => {
  await deleteMediaService(req.params.id, req.user);

  res.json({
    status: "success",
    message: "Media deleted successfully",
  });
});
