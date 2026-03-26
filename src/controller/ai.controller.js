const { processChatService } = require("../service/ai.service");
const catchAsync = require("../utils/catchAsync");

const processChatController = catchAsync(async (req, res) => {
  const response = await processChatService(req.body, req.user);
  res.status(200).json({ message: "Chat processed successfully", data: response });
});

module.exports = {
  processChatController
};
