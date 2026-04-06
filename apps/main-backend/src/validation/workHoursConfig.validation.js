const Joi = require("joi");

const createWorkHoursConfigSchema = Joi.object({
    workHoursModal: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    workingDurationMinutesMin: Joi.number().required(),
    workingDurationMintesMax: Joi.number().required(),
    shiftTimes: Joi.array().items(Joi.string()),
    weeklyOffDays: Joi.array().items(Joi.number())
})


const updateWorkHoursConfigSchema = Joi.object({
    id: Joi.number().required(),
    workHoursModal: Joi.string(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    workingDurationMinutesMin: Joi.number(),
    workingDurationMintesMax: Joi.number(),
    shiftTimes: Joi.array().items(Joi.string()),
    weeklyOffDays: Joi.array().items(Joi.number())
})

const workHoursConfigIdSchema = Joi.object({
    id: Joi.number().required()
})

module.exports = {
    createWorkHoursConfigSchema,
    updateWorkHoursConfigSchema,
    workHoursConfigIdSchema
};
