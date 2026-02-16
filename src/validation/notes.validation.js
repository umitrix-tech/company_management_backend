const Joi = require("joi");

/**
 * CREATE
 */
const createNotesSchema = Joi.object({
  title: Joi.string().trim().min(2).required(),
  content: Joi.string().trim().required(),
  startDate: Joi.date().required(),
});

/**
 * UPDATE
 */
const updateNotesSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().trim().min(2).optional(),
  content: Joi.string().trim().optional(),
  startDate: Joi.date().optional(),
}).min(1);

/**
 * LIST (query params)
 */
const listNotesSchema = Joi.object({
  search: Joi.string().trim().allow(""),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
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
  createNotesSchema,
  updateNotesSchema,
  listNotesSchema,
  idParamSchema,
};