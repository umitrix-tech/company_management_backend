const Joi = require("joi");

/**
 * PUNCH IN
 */
const punchInSchema = Joi.object({
  targetUserId: Joi.number().integer().optional(),
  companyId: Joi.number().integer().optional(),
});


const punchOutSchema = Joi.object({
  targetUserId: Joi.number().integer().optional(),
  companyId: Joi.number().integer().optional(),
});

/**
 * LIST
 */
const listPunchLogSchema = Joi.object({
  userId: Joi.number().integer().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
});

module.exports = {
  punchInSchema,
  punchOutSchema,
  listPunchLogSchema,
};
