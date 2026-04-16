const Joi = require("joi")

exports.createUserSchema = Joi.object({

  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().optional(),

  password: Joi.string().min(6).required(),

  role: Joi.string()
    .valid("user", "clientadmin")
    .optional(),

  clientId: Joi.string().when('$isSuperAdmin', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
    })
})