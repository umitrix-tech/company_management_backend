const Joi = require("joi");

/**
 * CREATE
 */
const createEmployeeTaxConfigSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  // regime: Joi.string().valid("OLD", "NEW").required(),
  standardDeduction: Joi.boolean().default(true),
  declared80C: Joi.number().min(0).default(0),
  effectiveFrom: Joi.date().required(),
  effectiveTo: Joi.date().optional().allow(null),
});

/**
 * UPDATE
 */
const updateEmployeeTaxConfigSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  // regime: Joi.string().valid("OLD", "NEW").optional(),
  standardDeduction: Joi.boolean().optional(),
  declared80C: Joi.number().min(0).optional(),
  effectiveFrom: Joi.date().optional(),
  effectiveTo: Joi.date().optional().allow(null),
}).min(1);

/**
 * LIST (query params)
 */
const listEmployeeTaxConfigSchema = Joi.object({
  userId: Joi.number().integer().positive().optional(),
  // regime: Joi.string().valid("OLD", "NEW").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

/**
 * PARAM :id
 */
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createEmployeeTaxConfigSchema,
  updateEmployeeTaxConfigSchema,
  listEmployeeTaxConfigSchema,
  idParamSchema,
};
