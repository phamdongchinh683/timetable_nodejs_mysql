const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const accountTeacherSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/^[\w.-]+@[a-zA-Z\d-]+\.(edu)$/)
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.pattern.base": "Email must be a valid address ending in .edu",
    }),
  password: Joi.string().min(10).max(60).trim().strict().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password length must be at least 10 characters long",
    "string.max": "The maximum length of a password is 60",
  }),
  role_id: Joi.string().required().messages({
    "any.required": "Role ID is required",
    "string.guid": "Role ID must be a valid UUID",
  }),
  level: Joi.string().valid("Doctorate", "Master").required().messages({
    "any.required": "Level is required",
    "any.only": "Level must be one Doctorate or Master",
  }),
  full_name: Joi.string().max(50).required().messages({
    "any.required": "Full name is required",
    "string.max": "Full name length must not exceed 50 characters",
  }),
});

const validateAccountsTeacherArray = async (req, res, next) => {
  const arraySchema = Joi.array().items(accountTeacherSchema).min(1).required();

  try {
    const values = await arraySchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

const validateAccountTeacher = async (req, res, next) => {
  let validate = Joi.object({
    level: Joi.string().valid("Doctorate", "Master").required().messages({
      "any.required": "Level is required",
      "any.only": "Level must be one Doctorate or Master",
    }),
    full_name: Joi.string().max(50).required().messages({
      "any.required": "Full name is required",
      "string.max": "Full name length must not exceed 50 characters",
    }),
  });

  try {
    const values = await validate.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = { validateAccountsTeacherArray, validateAccountTeacher };
