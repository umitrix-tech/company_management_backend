const Joi = require("joi");

/**
 * APPLY LEAVE
 */
const applyLeaveSchema = Joi.object({
  leaveTypeId: Joi.number().integer().positive().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  reason: Joi.string().trim().optional(),
});

/**
 * APPROVE / REJECT LEAVE
 */
const approveLeaveSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  status: Joi.string().valid("APPROVED", "REJECTED", "CANCELLED").required(),
  reason: Joi.string().trim().optional(), // Approval/Rejection comment
});

/**
 * LIST
 */
const listLeaveRequestSchema = Joi.object({
  userId: Joi.number().integer().positive().optional(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED", "CANCELLED").optional(),
  leaveTypeId: Joi.number().integer().positive().optional(),
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
  applyLeaveSchema,
  approveLeaveSchema,
  listLeaveRequestSchema,
  idParamSchema,
};
