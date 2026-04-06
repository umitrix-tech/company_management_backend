const { 
  getPlanHistoryService, 
  getPlanHistoryByIdService,
  listPlanHistoryService 
} = require("../service/planHistory.service");
const catchAsync = require("../utils/catchAsync");

/**
 * Get current active plan for the company
 */
const getCurrentPlanController = catchAsync(async (req, res) => {
  const response = await getPlanHistoryService(req.user);
  res.status(200).json({ 
    message: "Current plan retrieved successfully", 
    data: response 
  });
});

/**
 * Get plan history by ID
 */
const getPlanHistoryByIdController = catchAsync(async (req, res) => {
  const response = await getPlanHistoryByIdService(req.params.id, req.user);
  res.status(200).json({ 
    message: "Plan history retrieved successfully", 
    data: response 
  });
});

/**
 * List all plan history with pagination and filters
 */
const listPlanHistoryController = catchAsync(async (req, res) => {
  const response = await listPlanHistoryService(req.query, req.user);
  res.status(200).json({
    message: "Plan history list retrieved successfully",
    data: response.data,
    pagination: response.pagination
  });
});

module.exports = {
  getCurrentPlanController,
  getPlanHistoryByIdController,
  listPlanHistoryController
};
