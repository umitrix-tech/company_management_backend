const Joi = require("joi");

/**
 * SALARY COMPONENT (for EmployeeSalary)
 */
const salaryComponentSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().optional().allow(null, ""),
  componentType: Joi.string().valid("EARNING", "DEDUCTION").required(),
  valueType: Joi.string().valid("FIXED", "PERCENTAGE", "FORMULA").required(),
  value: Joi.number().min(0).required(),
  formula: Joi.string().optional().allow(null, ""),
  isTaxable: Joi.boolean().default(true),
  order: Joi.number().integer().optional(),
});

/**
 * SETUP EMPLOYEE SALARY
 */
const setupEmployeeSalarySchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  
  // Tax Config
  taxSlabId: Joi.number().integer().positive().required(),
  standardDeduction: Joi.boolean().default(true),
  declared80C: Joi.number().min(0).default(0),

  // Salary
  salaryMode: Joi.string().valid("MONTHLY", "DAILY", "HOURLY").required(),
  effectiveFrom: Joi.date().required(),
  templateId: Joi.number().integer().positive().optional(),
  
  // Custom components if not using template or overriding
  components: Joi.array().items(salaryComponentSchema).optional(),
  
  // To track first salary vs hike
  isFirstSalary: Joi.boolean().default(false),
  oldSalary: Joi.number().min(0).optional().default(0),
  newSalary: Joi.number().min(0).required(), // Total Gross or Base? User said "base salary first create salry histroy"
});

/**
 * GET HISTORY / LIST
 */
const listEmployeeSalarySchema = Joi.object({
  userId: Joi.number().integer().positive().optional(),
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
  setupEmployeeSalarySchema,
  listEmployeeSalarySchema,
  idParamSchema,
};
