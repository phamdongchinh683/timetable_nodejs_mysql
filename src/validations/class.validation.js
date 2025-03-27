const Joi = require("joi");
const { responseStatus } = require("../globals/handler");

const classSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Email is required",
  }),
});

const validateClasses = async (req, res, next) => {
  const arraySchema = Joi.array().items(classSchema).min(1).required();

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


module.exports = { validateClasses };
