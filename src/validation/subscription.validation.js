const Joi = require('joi');

const createSubscriptionSchema = Joi.object({
  tierOfPlan: Joi.string().valid('FREE', 'MONTH_PAY', 'YEAR_PAY', 'SOLD').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  companyId: Joi.number().integer().optional(),
});

const listSubscriptionSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  tierOfPlan: Joi.string().valid('FREE', 'MONTH_PAY', 'YEAR_PAY', 'SOLD').optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createSubscriptionSchema,
  listSubscriptionSchema,
};
