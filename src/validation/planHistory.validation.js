const Joi = require("joi");

/**
 * All fields are optional and unknown fields are allowed
 */
const listPlanHistorySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  isActive: Joi.boolean().optional(),
  tierOfPlan: Joi.string().valid('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE').optional(),
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  sortBy: Joi.string().valid('id', 'tierOfPlan', 'startDate', 'endDate', 'isActive', 'createdAt', 'updatedAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
}).unknown(true); // CRITICAL: Allow unknown fields

/**
 * Plan history ID param validation
 */
const planHistoryIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
}).unknown(true); // Allow unknown fields

module.exports = {
  listPlanHistorySchema,
  planHistoryIdParamSchema
};