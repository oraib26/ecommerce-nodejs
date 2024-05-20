import couponModel from "../../../db/model/coupon.model.js";

export const create = async (req, res) => {
  if (await couponModel.findOne({ name: req.body.name })) {
    return res.status(409).json({ message: "coupon is already exists" });
  }

  req.body.expireDate = new Date(req.body.expireDate);

  const coupon = await couponModel.create(req.body);

  return res.json({ message: coupon });
};
