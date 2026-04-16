const Joi = require("joi")

exports.createClientSchema = Joi.object({

  companyName: Joi.string()
    .min(3)
    .max(100)
    .required(),

  industryType: Joi.string()
    .valid("real_estate", "coaching", "showroom")
    .required(),

  planType: Joi.string()
    .valid("basic", "pro", "enterprise")
    .required(),

  features: Joi.object({
    whatsapp: Joi.boolean().default(false),
    advancedReports: Joi.boolean().default(false),
    exportData: Joi.boolean().default(false)
  }).optional()

})