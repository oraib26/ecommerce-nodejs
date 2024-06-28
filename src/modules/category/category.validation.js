import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createCategory = joi.object({
    name: joi.string().min(3).max(25).required(),
   
    file: generalFields.file.required(),

})
export const updateCategory = joi.object({
    name: joi.string().min(3).max(25),
    status: joi.string().valid('Active', 'Inactive').default('Active'),
    id: joi.string().hex().min(24).max(24),
    file: generalFields.file.optional(),
});
export const Categoryid = joi.object({
    id: joi.string().hex().min(24).max(24).required(),
})