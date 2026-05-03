const Joi = require("joi");

const listNotificationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow("").optional(),
  type: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional()
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  listNotificationSchema,
  idParamSchema,
};
