import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
export const RegisterSchema = joi.object({
    userName: joi.string().pattern(new RegExp('^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669]+$')).min(3).max(20).required().messages({
        "string.empty": "userName is required",
    }
    ).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    checkPassword: joi.valid(joi.ref('password')).required(),

});
export const LogInSchema = joi.object({

    email: generalFields.email.required(),
    password: generalFields.password.required(),

})
export const sendCodevalidation=joi.object({
    email: generalFields.email.required(),
});
export const forgotPasswordvalid=joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    code: joi.string().length(4).required() 
})
