const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const accountStudentSchema = Joi.object({
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
  roleId: Joi.string().required().messages({
    "any.required": "Role ID is required",
    "string.guid": "Role ID must be a valid UUID",
  }),
  fullName: Joi.string().max(50).required().messages({
    "any.required": "Full name is required",
    "string.max": "Full name length must not exceed 50 characters",
  }),
  age: Joi.number().integer().min(1).max(150).required().messages({
    "any.required": "Age is required",
    "number.base": "Age must be a number",
    "number.integer": "Age must be an integer",
    "number.min": "Age must be at least 1",
    "number.max": "Age must not exceed 150",
  }),
  course: Joi.string().max(10).required().messages({
    "any.required": "Course is required",
    "string.max": "Course length must not exceed 10 characters",
  }),
  studentCode: Joi.string().max(10).required().messages({
    "any.required": "Student code is required",
    "string.max": "Student code length must not exceed 10 characters",
  }),
  classId: Joi.string().required().messages({
    "any.required": "Class ID is required",
  }),
});

const validateAccountsStudentArray = async (req, res, next) => {
  const arraySchema = Joi.array().items(accountStudentSchema).min(1).required();

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

const validateAccountStudent = async (req, res, next) => {
  let validate = Joi.object({
    fullName: Joi.string().max(50).required().messages({
      "any.required": "Full name is required",
      "string.max": "Full name length must not exceed 50 characters",
    }),
    age: Joi.number().integer().min(1).max(150).required().messages({
      "any.required": "Age is required",
      "number.base": "Age must be a number",
      "number.integer": "Age must be an integer",
      "number.min": "Age must be at least 1",
      "number.max": "Age must not exceed 150",
    }),
    course: Joi.string().max(10).required().messages({
      "any.required": "Course is required",
      "string.max": "Course length must not exceed 10 characters",
    }),
    studentCode: Joi.string().max(10).required().messages({
      "any.required": "Student code is required",
      "string.max": "Student code length must not exceed 10 characters",
    }),
    classId: Joi.string().required().messages({
      "any.required": "Class ID is required",
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

module.exports = { validateAccountsStudentArray, validateAccountStudent };
