const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const userSchema = Joi.object({
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
  password: Joi.string().min(10).max(60).trim().strict().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password length must be at least 10 characters long",
    "string.max": "The maximum length of a password is 60",
  }),
  role_id: Joi.string().required().messages({
    "any.required": "Role is required",
  }),
});

const validateUsersArray = async (req, res, next) => {
  const arraySchema = Joi.array().items(userSchema).min(1).required();

  try {
    const values = await arraySchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.users = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

const validateUser = async (req, res, next) => {
  try {
    const values = await userSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = { validateUsersArray, validateUser };
