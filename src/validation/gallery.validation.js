const Joi = require("joi");

/**
 * CREATE
 */
const createGallerySchema = Joi.object({
  tag: Joi.string().trim().min(2).required(),
  mediaId: Joi.number().integer().positive().required(),
});

/**
 * UPDATE
 */
const updateGallerySchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  tag: Joi.string().trim().min(2).required(),
  mediaId: Joi.number().integer().positive().required(),
}).min(1);

/**
 * LIST (query params)
 */
const listGallerySchema = Joi.object({
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
  createGallerySchema,
  updateGallerySchema,
  listGallerySchema,
  idParamSchema,
};