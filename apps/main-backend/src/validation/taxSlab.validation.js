const Joi = require("joi");

/**
 * SLAB Detail
 */
const slabSchema = Joi.object({
  minIncome: Joi.number().min(0).required(),
  maxIncome: Joi.number().min(Joi.ref("minIncome")).allow(null).optional(),
  taxRate: Joi.number().min(0).max(100).required(),
});

/**
 * CREATE
 */
const createTaxSlabSchema = Joi.object({
  regime: Joi.string().trim().required(),
  skipPopUp: Joi.boolean().optional(),
  financialYear: Joi.string().trim().required(),
  slabs: Joi.array().items(slabSchema).min(1).required(),
});

/**
 * UPDATE
 */
const updateTaxSlabSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  regime: Joi.string().trim().required(),
  financialYear: Joi.string().trim().optional(),
  slabs: Joi.array().items(slabSchema).optional(),
}).min(1);

/**
 * LIST (query params)
 */
const listTaxSlabSchema = Joi.object({
  financialYear: Joi.string().trim().optional(),
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
  createTaxSlabSchema,
  updateTaxSlabSchema,
  listTaxSlabSchema,
  idParamSchema,
};
