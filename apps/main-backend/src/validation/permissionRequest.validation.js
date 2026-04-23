const Joi = require("joi");

/**
 * APPLY PERMISSION
 */
const applyPermissionSchema = Joi.object({
  date: Joi.date().iso().required(),
  startTime: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(), // "HH:mm"
  endTime: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(),
  reason: Joi.string().trim().optional(),
});

/**
 * STATUS UPDATE
 */
const updatePermissionStatusSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  status: Joi.string().valid("APPROVED", "REJECTED", "CANCELLED").required(),
});

/**
 * LIST
 */
const listPermissionRequestSchema = Joi.object({
  userId: Joi.number().integer().positive().optional(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED", "CANCELLED").optional(),
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
  applyPermissionSchema,
  updatePermissionStatusSchema,
  listPermissionRequestSchema,
  idParamSchema,
};
