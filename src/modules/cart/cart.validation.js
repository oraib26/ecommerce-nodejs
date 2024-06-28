import joi from 'joi';
export const productIdValid=joi.object({
    productId: joi.string().hex().min(24).max(24).required(),
   

})

export const updateQuantityvalid=joi.object({
    quantity: joi.number().integer().min(1).required(),
  operator: joi.string().valid('+', '-').required(),
  productId: joi.string().hex().min(24).max(24).required(),
})