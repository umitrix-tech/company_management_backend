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

const downloadPunchLogExcelSchema = Joi.object({
  userId: Joi.number().integer().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});



const listEmployeeAttendanceSchema = Joi.object({
  search: Joi.string().allow("", null).optional(),
  date: Joi.date().required(),

  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
});

const employeeAttendanceDashboardSchema = Joi.object({
  date: Joi.date().optional()
});

module.exports = {
  punchInSchema,
  punchOutSchema,
  listPunchLogSchema,
  listEmployeeAttendanceSchema,
  employeeAttendanceDashboardSchema,
  downloadPunchLogExcelSchema,
};
