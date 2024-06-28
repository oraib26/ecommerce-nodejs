import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createsubCategory = joi.object({
  name: joi.string().min(3).max(25).required(),
  categoryId: joi.string().hex().min(24).max(24).required(),
  file: generalFields.file.required(),
});

export const validationid = joi.object({
  id: joi.string().hex().min(24).max(24).required(),
});
export const validationsubId = joi.object({
  subcategoryId: joi.string().hex().min(24).max(24),
});
export const updateSub = joi.object({
  name: joi.string().min(3).max(25),
  status: joi.string().valid("Active", "Inactive").default("Active"),
  id: joi.string().hex().min(24).max(24).required,
});
