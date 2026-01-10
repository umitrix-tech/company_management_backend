const Joi = require("joi");

const updateUserSchemaValidation = Joi.object({
    id:Joi.number().required().positive(),
    name: Joi.string().trim().min(2).max(100),
    empCode: Joi.string().trim().max(50),
    adharNumber: Joi.string()
        .pattern(/^\d{12}$/)
        .message("Aadhaar number must be 12 digits")
        .allow(null),
    uanNumber: Joi.string()
        .pattern(/^\d{12}$/)
        .message("UAN number must be 12 digits")
        .allow(null),
    bankAccount: Joi.string().trim().max(30).allow(null),
    address: Joi.string().trim().max(255).allow(null),
    city: Joi.string().trim().max(100).allow(null),
    pinCode: Joi.string()
        .pattern(/^\d{6}$/)
        .message("Pincode must be 6 digits")
        .allow(null),
    state: Joi.string().trim().max(100).allow(null),
    country: Joi.string().trim().max(100).allow(null),
    email: Joi.string().email().allow(null),
    bloodGroup: Joi.string()
        .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
        .allow(null),
    ifscCode: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .message("Invalid IFSC code")
        .allow(null),
    gender: Joi.string()
        .valid("MALE", "FEMALE", "OTHER")
        .allow(null),
    epfNumber: Joi.string().trim().max(30).allow(null),
    esicNumber: Joi.string().trim().max(30).allow(null),
    mobileNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid mobile number")
        .allow(null),
    SecondaryMobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid secondary mobile number")
        .allow(null),
    status: Joi.string().optional(),
    documets: Joi.array().items(Joi.string().trim()),
    roleId: Joi.number().integer().positive(),
    // WorkHoursConfigurationId: Joi.number().integer().positive(),
})
    .min(1);


const createUserSchemaValidation = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    empCode: Joi.string().trim().max(50),
    adharNumber: Joi.string()
        .pattern(/^\d{12}$/)
        .message("Aadhaar number must be 12 digits")
        .allow(null),
    uanNumber: Joi.string()
        .pattern(/^\d{12}$/)
        .message("UAN number must be 12 digits")
        .allow(null),
    bankAccount: Joi.string().trim().max(30).allow(null),
    address: Joi.string().trim().max(255).allow(null),
    city: Joi.string().trim().max(100).allow(null),
    pinCode: Joi.string()
        .pattern(/^\d{6}$/)
        .message("Pincode must be 6 digits")
        .allow(null),
    state: Joi.string().trim().max(100).allow(null),
    country: Joi.string().trim().max(100).allow(null),
    email: Joi.string().email().allow(null),
    bloodGroup: Joi.string()
        .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
        .allow(null),
    ifscCode: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .message("Invalid IFSC code")
        .allow(null),
    gender: Joi.string()
        .valid("MALE", "FEMALE", "OTHER")
        .allow(null),
    epfNumber: Joi.string().trim().max(30).allow(null),
    esicNumber: Joi.string().trim().max(30).allow(null),
    mobileNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid mobile number")
        .allow(null),
    SecondaryMobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid secondary mobile number")
        .allow(null),
    status: Joi.string().optional(),
    documets: Joi.array().items(Joi.string().trim()),
    roleId: Joi.number().integer().positive(),
    // WorkHoursConfigurationId: Joi.number().integer().positive(),
})
    .min(1);
const userProfileListValidation = Joi.object({
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).default(20),
    search: Joi.string().optional().allow(null),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
})

const userProfileDeleteValidation = Joi.object({
    id: Joi.number().integer().positive().required()
})


module.exports = {
    updateUserSchemaValidation,
    userProfileListValidation,
    createUserSchemaValidation,
    userProfileDeleteValidation
}