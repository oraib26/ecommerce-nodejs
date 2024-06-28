import joi from "joi";

export const updateStatus = joi.object({
  status: joi
    .string()
    .valid("pending", "cancelled", "confirmed", "onWay", "delivered"),
  orderId: joi.string().min(24).max(24),
});

export const createOrder = joi.object({
  Address: joi.string().min(3).max(20).required(),
  phoneNumber: joi.string().length(10).required(),
  couponName: joi.string().min(3).max(25),
});
