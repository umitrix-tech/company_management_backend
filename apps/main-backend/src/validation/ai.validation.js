const Joi = require("joi");

const processChatValidation = Joi.object({
  query: Joi.string().required(),
})

module.exports = {
  processChatValidation
};
