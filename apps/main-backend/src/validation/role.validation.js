const Joi = require("joi");

/**
 * CREATE ROLE
 */

const rolePermissionSchema = Joi.array().items(
    Joi.object({
        key: Joi.string().required(),
        label: Joi.string().required(),
        access: Joi.boolean().default(false),
        children: Joi.array().items(
            Joi.object({
                key: Joi.string().required(),
                label: Joi.string().required(),
                access: Joi.boolean().default(false),
            })
        ).default([]) // optional, empty array if no children
    })
).required();


const createRoleSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),
    rolePermission: rolePermissionSchema

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
    rolePermission: rolePermissionSchema

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
