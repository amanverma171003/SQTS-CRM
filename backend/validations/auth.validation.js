const Joi = require("joi")

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

exports.createSuperAdminSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "string.pattern.base":
            "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
        })
})



// login validations

exports.loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    
    password: Joi.string()
        .required()

})