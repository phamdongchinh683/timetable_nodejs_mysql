const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const roomSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Email is required",
  }),
});

const roomEmptySchema = Joi.object({
  dayOfWeek: Joi.number().min(2).max(7).required().messages({
    "any.required": "Day of week is required",
    "number.base": "Day of week must be a number",
    "number.min": "Day of week must be between 2 (Monday) and 7 (Saturday)",
    "number.max": "Day of week must be between 2 (Monday) and 7 (Saturday)",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Invalid date format",
  }),
});

const validateEmptyRoom = (req, res, next) => {
  const { error, value } = roomEmptySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const errorDetail = error.details.map((err) => err.message).join(", ");
    return responseStatus(res, 422, "failed", errorDetail);
  }

  req.data = value;
  next();
};

const validateRooms = async (req, res, next) => {
  const arraySchema = Joi.array().items(roomSchema).min(1).required();

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

module.exports = { validateRooms, validateEmptyRoom };
