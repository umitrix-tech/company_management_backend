const Joi = require("joi");

const assignManagerValidation = Joi.object({
    userId: Joi.number().integer().positive().required(),
    reportingId: Joi.number().integer().positive().required()
});

const removeManagerValidation = Joi.object({
    userId: Joi.number().integer().positive().required()
});

module.exports = {
    assignManagerValidation,
    removeManagerValidation
};
