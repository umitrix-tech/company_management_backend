const Joi = require("joi");

const createCallSchema = Joi.object({
  callerId: Joi.number().required(),
  receiverId: Joi.number().required(),
  customerId: Joi.number().optional().allow(null),
  companyId: Joi.number().required(),
  callType: Joi.string().valid("CUSTOMER", "INTERNAL").required(),
  callStatus: Joi.string().valid("PENDING", "ONGOING", "COMPLETED", "CANCELLED").default("PENDING"),
});

const updateConnectTimeSchema = Joi.object({
  callConnectedAt: Joi.date().required(),
});

const listCallSchema = Joi.object({
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("").default(""),
  callStatus: Joi.string().valid("PENDING", "ONGOING", "COMPLETED", "CANCELLED").optional(),
  callType: Joi.string().valid("CUSTOMER", "INTERNAL").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  userId: Joi.number().optional(),
  customerId: Joi.number().optional(),
});

const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional().allow(""),
  callId: Joi.number().required(),
  customerId: Joi.number().optional().allow(null),
  userId: Joi.number().optional().allow(null),
});

module.exports = {
  createCallSchema,
  updateConnectTimeSchema,
  listCallSchema,
  createReviewSchema,
};
