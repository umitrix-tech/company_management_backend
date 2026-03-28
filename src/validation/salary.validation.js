const Joi = require("joi");

const salaryTemplateSchema = Joi.object({
  name: Joi.string().required(),
  components: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        componentType: Joi.string().valid("EARNING", "DEDUCTION").required(),
        valueType: Joi.string().valid("FIXED", "PERCENTAGE").required(),
        value: Joi.number().required(),
        order: Joi.number().integer().optional(),
      })
    )
    .required(),
});

const assignSalarySchema = Joi.object({
  userId: Joi.number().integer().required(),
  templateId: Joi.number().integer().optional(),
  salaryMode: Joi.string().valid("MONTHLY", "DAILY", "HOURLY").required(),
  baseSalary: Joi.number().required(),
  workingDaysPerMonth: Joi.number().integer().optional(),
  workingHoursPerDay: Joi.number().integer().optional(),
  effectiveFrom: Joi.date().required(),
  components: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        componentType: Joi.string().valid("EARNING", "DEDUCTION").required(),
        valueType: Joi.string().valid("FIXED", "PERCENTAGE").required(),
        value: Joi.number().required(),
        order: Joi.number().integer().optional(),
      })
    )
    .optional(),
});

const createLoanSchema = Joi.object({
  userId: Joi.number().integer().required(),
  principalAmount: Joi.number().positive().required(),
  interestRate: Joi.number().min(0).required(),
  tenureMonths: Joi.number().integer().positive().required(),
  disbursedAt: Joi.date().optional(),
  olderLoanId: Joi.number().integer().optional(),
});

const addAdjustmentSchema = Joi.object({
  userId: Joi.number().integer().required(),
  name: Joi.string().required(),
  componentType: Joi.string().valid("EARNING", "DEDUCTION").required(),
  amount: Joi.number().positive().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).required(),
});

const generateSlipSchema = Joi.object({
  userId: Joi.number().integer().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).required(),
});

const getLoansSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
});

const getLoanStatsSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).required(),
});

const loanActionSchema = Joi.object({
  id:Joi.number().integer().min(1).required(),
  action: Joi.string().valid("PRE_CLOSE", "HOLD", "RESUME", "PARTIAL_PAYMENT", "REOPEN").required(),
  amount: Joi.number().positive().when("action", {
    is: "PARTIAL_PAYMENT",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

module.exports = {
  salaryTemplateSchema,
  assignSalarySchema,
  createLoanSchema,
  addAdjustmentSchema,
  generateSlipSchema,
  getLoansSchema,
  getLoanStatsSchema,
  loanActionSchema,
};
