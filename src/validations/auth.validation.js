const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const userSchema = Joi.object({
  password: Joi.string().min(10).max(60).trim().strict().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password length must be at least 10 characters long",
    "string.max": "The maximum length of a password is 60",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[\w.-]+@[a-zA-Z\d-]+\.(edu)$/)
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.pattern.base":
        "Email must be a valid address ending in .com, .edu, .net, .org, or .gov",
    }),
  role: Joi.string().valid("Student", "Teacher").required().messages({
    "any.required": "Role is required",
    "any.only": "Role must be either 'Student' or 'Teacher'",
  }),
});

const validateUsersArray = async (req, res, next) => {
  const arraySchema = Joi.array().items(userSchema).min(1).required();

  try {
    const value = await arraySchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.users = value;
    req.user = payload;

    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = { validateUsersArray };
