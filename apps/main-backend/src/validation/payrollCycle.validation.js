const Joi = require("joi");

const createPayrollCycleSchema = Joi.object({
  name: Joi.string().trim().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  payoutDate: Joi.date().iso().required(),
  status: Joi.string().valid("OPEN", "PROCESSING", "COMPLETED", "LOCKED").optional()
});

const updatePayrollCycleSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  payoutDate: Joi.date().iso().optional(),
  status: Joi.string().valid("OPEN", "PROCESSING", "COMPLETED", "LOCKED").optional()
}).min(1);

const listPayrollCycleSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createPayrollCycleSchema,
  updatePayrollCycleSchema,
  listPayrollCycleSchema,
  idParamSchema,
};
