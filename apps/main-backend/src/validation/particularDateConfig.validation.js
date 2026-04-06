const Joi = require("joi");

/**
 * CREATE
 */
const createParticularDateSchema = Joi.object({
  date: Joi.date().required(),
  reason: Joi.string().trim().min(2).required(),
  description: Joi.string().trim().allow("").optional(),
});

/**
 * UPDATE
 */
const updateParticularDateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  date: Joi.date().optional(),
  reason: Joi.string().trim().min(2).optional(),
  description: Joi.string().trim().allow("").optional(),
}).min(1); // at least one field required

/**
 * PARAM :id
 */
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

/**
 * LIST (query params)
 */
const listParticularDateSchema = Joi.object({
  search: Joi.string().trim().allow(""),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createParticularDateSchema,
  updateParticularDateSchema,
  idParamSchema,
  listParticularDateSchema,
};
