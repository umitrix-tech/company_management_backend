const Joi = require("joi");

/**
 * APPLY LEAVE
 */
const applyLeaveSchema = Joi.object({
  leaveTypeId: Joi.number().integer().positive().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  reason: Joi.string().trim().optional(),
  isHalfDay: Joi.boolean().default(false),
  halfDaySession: Joi.number().integer().valid(0, 1).when("isHalfDay", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
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
 * UPDATE LEAVE (User can update if still PENDING)
 */
const updateLeaveSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  leaveTypeId: Joi.number().integer().positive().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  reason: Joi.string().trim().optional(),
  isHalfDay: Joi.boolean().optional(),
  halfDaySession: Joi.number().integer().valid(0, 1).optional(),
});

/**
 * LIST
 */
const listLeaveRequestSchema = Joi.object({
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
  updateLeaveSchema,
  listLeaveRequestSchema,
  idParamSchema,
};
