const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const subjectTeacherSchema = Joi.object({
  teacherId: Joi.string().max(40).required().messages({
    "any.required": "teacherId is required",
    "string.max": "teacherId length must not exceed 50 characters",
  }),
  subjectId: Joi.string().max(40).required().messages({
    "any.required": "subjectId is required",
    "string.max": "subjectId length must not exceed 10 characters",
  }),
});

const validateSubjectTeacher = async (req, res, next) => {
  try {
    const values = await subjectTeacherSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = { validateSubjectTeacher };
