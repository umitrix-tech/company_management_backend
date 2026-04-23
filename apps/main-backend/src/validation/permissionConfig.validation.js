const Joi = require("joi");

/**
 * SETUP OR UPDATE PERMISSION CONFIG
 */
const setupPermissionConfigSchema = Joi.object({
  monthlyLimit: Joi.number().integer().min(0).required(),
  maxHoursPerPermission: Joi.number().min(0.5).required(),
});

module.exports = {
  setupPermissionConfigSchema,
};
