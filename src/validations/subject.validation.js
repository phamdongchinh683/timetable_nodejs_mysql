const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const subjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "subject is required",
    "string.empty": "subject cannot be empty",
  }),
  year: Joi.number().valid(1, 2, 3, 4).required().messages({
    "any.only": "Semester year must be one of [1, 2, 3, 4]",
    "any.required": "Semester year is required",
  }),
  semester: Joi.number().valid(1, 2).required().messages({
    "any.only": "Semester must be either 1 or 2",
    "any.required": "Semester is required",
  }),
});

const validateSubjects = async (req, res, next) => {
  const arraySchema = Joi.array().items(subjectSchema).min(1).required();

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

const validateUpdateSubject = async (req, res, next) => {
  try {
    const value = await subjectSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = value;

    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");

    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = { validateSubjects, validateUpdateSubject };
