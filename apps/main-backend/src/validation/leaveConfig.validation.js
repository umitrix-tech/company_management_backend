const Joi = require("joi");

/**
 * CREATE LEAVE TYPE & CONFIG
 */
const createLeaveTypeSchema = Joi.object({
  name: Joi.string().trim().required(),
  code: Joi.string().trim().uppercase().required(),
  isPaid: Joi.boolean().default(true),

  // Nested configuration
  config: Joi.object({
    monthlyLimit: Joi.number().min(0).optional(),
    yearlyLimit: Joi.number().min(0).optional(),
    gender: Joi.string().valid("ALL", "MALE", "FEMALE").optional(),
    canCarryForward: Joi.boolean().default(false),
    maxConsecutiveDays: Joi.number().integer().min(1).optional(),
  }).or("monthlyLimit", "yearlyLimit")   // 🔥 important line
    .required()
});

/**
 * UPDATE LEAVE TYPE & CONFIG
 */
const updateLeaveTypeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().uppercase().optional(),
  isPaid: Joi.boolean().optional(),

  config: Joi.object({
    monthlyLimit: Joi.number().min(0).optional(),
    yearlyLimit: Joi.number().min(0).optional(),
    gender: Joi.string().valid("ALL", "MALE", "FEMALE").optional(),
    canCarryForward: Joi.boolean().optional(),
    maxConsecutiveDays: Joi.number().integer().min(1).optional(),
  }).optional(),
}).min(1);

/**
 * LIST
 */
const listLeaveTypeSchema = Joi.object({
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
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
  listLeaveTypeSchema,
  idParamSchema,
};
