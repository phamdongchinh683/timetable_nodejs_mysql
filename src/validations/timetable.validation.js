const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const timetableSchema = Joi.object({
  classId: Joi.string().required().messages({
    "any.required": "Class ID is required",
    "string.empty": "Class ID cannot be an empty field",
  }),
  teacherSubjectId: Joi.string().required().messages({
    "any.required": "Teacher Subject ID is required",
    "string.empty": "Teacher Subject ID cannot be an empty field",
  }),
  roomId: Joi.string().required().messages({
    "any.required": "Room ID is required",
    "string.empty": "Room ID cannot be an empty field",
  }),
  period: Joi.string().valid("1-3", "4-6").required().messages({
    "any.required": "Period is required",
    "any.only": "Status must be either 1-3  or 4-6",
    "number.min": "Period must be at least 1",
  }),
  dayOfWeek: Joi.number().integer().min(2).max(7).required().messages({
    "any.required": "Day of the week is required",
    "number.base": "Day of the week must be a number",
    "number.integer": "Day of the week must be an integer",
    "number.min": "Day of the week must be between 2 (Monday) and 7 (Saturday)",
    "number.max": "Day of the week must be between 2 (Monday) and 7 (Saturday)",
  }),
  status: Joi.string()
    .valid("ready", "pending", "canceled")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be either 'active','pending or 'inactive'",
    }),
  lesson: Joi.string()
    .valid("Morning", "Afternoon", "Evening")
    .required()
    .messages({
      "any.required": "Lesson is required",
      "string.empty": "Lesson cannot be an empty field",
      "any.only": "lesson must be either 'Morning' ,'Afternoon or 'Evening'",
    }),
  startDate: Joi.date().required().messages({
    "any.required": "Date of study is required",
    "date.base": "Date of study must be a valid date",
  }),
  endDate: Joi.date().required().messages({
    "any.required": "Date of study is required",
    "date.base": "Date of study must be a valid date",
  }),
});

const validateTimetablesArray = async (req, res, next) => {
  const arraySchema = Joi.array().items(timetableSchema).min(1).required();

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

const validateTimetable = async (req, res, next) => {
  try {
    const values = await timetableSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.data = values;
    next();
  } catch (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }
};

module.exports = {
  validateTimetablesArray,
  validateTimetable,
  timetableSchema,
};
