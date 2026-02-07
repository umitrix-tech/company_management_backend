// validations/policy.validation.js
const Joi = require("joi");

/**
 * Create Policy
 */
const createPolicySchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  roleAccess: Joi.array().items(Joi.number().integer()).required(),
  mediaUrls: Joi.array().items(Joi.string().uri()).optional()
});

/**
 * Update Policy
 */
const updatePolicySchema = Joi.object({
  name: Joi.string().min(3).optional(),
  description: Joi.string().min(5).optional(),
  roleAccess: Joi.array().items(Joi.number().integer()).optional()
});

/**
 * Policy ID param validation
 */
const policyIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  createPolicySchema,
  updatePolicySchema,
  policyIdParam
};
