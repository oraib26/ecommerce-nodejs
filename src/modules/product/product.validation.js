import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createproduct = joi.object({
  name: joi.string().min(3).max(25).required(),
  description: joi.string(),
  stock: joi.number().min(0).default(1),
  price: joi.number().required(),
  discount: joi.number().min(0).max(100),
  categoryId: joi.string().min(24).max(24).required(),
  subcategoryId: joi.string().min(24).max(24).required(),
  mainImage: joi
    .array()
    .items({
      size: joi.number().max(50000000).required(),
      path: joi.string().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      mimetype: joi.string().required(),
      encoding: joi.string().required(),
      originalname: joi.string().required(),
      fieldname: joi.string().required(),
      dest: joi.string(),
    })
    .required(),

  subImages: joi
    .array()
    .items(
      joi.object({
        size: joi.number().max(50000000).required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
        dest: joi.string(),
      })
    )
    .max(4)
    .optional(),

  sizes: joi.array().items(joi.string().valid("s", "m", "lg", "xl")).optional(),
});
