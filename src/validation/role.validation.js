const Joi = require("joi");

/**
 * CREATE ROLE
 */
const createRoleSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    // accepts ANY valid JSON (object, array, nested, etc.)
    privileges: Joi.any().required()
});

/**
 * UPDATE ROLE
 */
const updateRoleSchema = Joi.object({
       id: Joi.number()
        .integer()
        .positive()
        .required(),
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .optional(),

    privileges: Joi.any().required()
}).min(1);

const listRoleSchema = Joi.object({
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).default(20),
    search: Joi.string().optional().allow(null),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),

})

/**
 * PARAM ID
 */
const roleIdParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});

module.exports = {
    createRoleSchema,
    updateRoleSchema,
    roleIdParamSchema,
    listRoleSchema
};
