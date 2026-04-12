const Joi = require("joi");

/**
 * TEMPLATE COMPONENT
 */
const templateComponentSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().optional().allow(null, ""),
  componentType: Joi.string().valid("EARNING", "DEDUCTION").required(),
  valueType: Joi.string().valid("FIXED", "PERCENTAGE", "FORMULA").required(),
  value: Joi.number().min(0).required(),
  formula: Joi.string().optional().allow(null, ""),
  isTaxable: Joi.boolean().default(true),
  order: Joi.number().integer().optional(),
});

/**
 * CREATE
 */
const createSalaryTemplateSchema = Joi.object({
  name: Joi.string().trim().required(),
  components: Joi.array().items(templateComponentSchema).min(1).required(),
});

/**
 * UPDATE
 */
const updateSalaryTemplateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().optional(),
  components: Joi.array().items(templateComponentSchema).optional(),
}).min(1);

/**
 * LIST
 */
const listSalaryTemplateSchema = Joi.object({
  search: Joi.string().trim().allow(""),
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
  createSalaryTemplateSchema,
  updateSalaryTemplateSchema,
  listSalaryTemplateSchema,
  idParamSchema,
};
