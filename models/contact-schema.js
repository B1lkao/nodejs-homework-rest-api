const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../utils");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
        type: String,
        required: [true, "Set email for contact"],
      unique: true, 
    },
    phone: {
      type: String,
      required: [true, "Set phone number for contact"],
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);
contactSchema.post('save', handleMongooseError);
const addSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "Name must not be empty",
    "string.empty": "Name must not be empty",
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "any.required": "Email must not be empty",
      "string.empty": "Email must not be empty",
      "string.pattern.base": "Email does not have a right format",
    }),
  phone: Joi.string()
    .required()