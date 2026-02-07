const Joi = require("joi");

/**
 * CREATE
 */
const createPolicySchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().trim().allow("").optional(),
  roleAccess: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required(),
  mediaId: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required(),
});

/**
 * UPDATE
 */
const updatePolicySchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(2).optional(),
  description: Joi.string().trim().allow("").optional(),
  roleAccess: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .optional(),
  mediaId: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .optional(),
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
const listPolicySchema = Joi.object({
  search: Joi.string().trim().allow(""),
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createPolicySchema,
  updatePolicySchema,
  idParamSchema,
  listPolicySchema,
};
