const Joi = require("joi");
const generateError = require("../helpers/generateError");

const commentSchema = Joi.string()
  .min(4)
  .max(500)
  .error(
    generateError("Your comment must have between 4 and 500 characters", 404)
  );

module.exports = commentSchema;
