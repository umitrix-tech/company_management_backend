const { 
  createSubscriptionService, 
  listSubscriptionService 
} = require("../service/subscription.service");
const catchAsync = require("../utils/catchAsync");

/**
 * Create a new subscription
 */
const createSubscriptionController = catchAsync(async (req, res) => {
  const response = await createSubscriptionService(req.body, req.user);
  res.status(201).json({ 
    message: "Subscription created successfully", 
    data: response 
  });
});

/**
 * List all subscriptions for a company
 */
const listSubscriptionController = catchAsync(async (req, res) => {
  const response = await listSubscriptionService(req.query, req.user);
  res.status(200).json({
    message: "Subscriptions retrieved successfully",
    data: response.data,
    pagination: response.pagination
  });
});

module.exports = {
  createSubscriptionController,
  listSubscriptionController
};
