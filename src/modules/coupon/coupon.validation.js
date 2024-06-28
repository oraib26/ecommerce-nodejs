import joi from 'joi';
export const CreateCoupon = joi.object({
    name:joi.string().min(3).max(25).required(),
    amount:joi.number().positive(),
    expireDate:joi.date().greater('now').required(),
});

