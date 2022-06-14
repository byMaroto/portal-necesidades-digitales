const Joi = require("joi");
const generateError = require("../helpers/generateError");

const newServiceSchema = Joi.object({
  title: Joi.string()
    .min(4)
    .max(100)
    .error(generateError("Title must have between 4 and 100 characters", 400)),
  description: Joi.string()
    .min(4)
    .max(500)
    .error(
      generateError("Description must have between 4 and 500 characters", 400)
    ),
});

const serviceIdSchema = Joi.number()
  .required()
  .error(generateError("Service id is required and must be a number", 404));

module.exports = { newServiceSchema, serviceIdSchema };
