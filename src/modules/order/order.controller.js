import cartModel from "../../../db/model/cart.model.js";
import couponModel from "../../../db/model/coupon.model.js";
import orderModel from "../../../db/model/order.model.js";

export const create = async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });

  // return res.json({cart})
  if (!cart) {
    return res.status(400).json("cart is empty");
  }

  if (req.body.couponId) {
    const coupon = await couponModel.findById(req.body.couponId);

    if (!coupon) {
      return res.status(400).json("coupon not found");
    }

    if (coupon.expireDate < new Date()) {
      return res.status(400).json("coupon was expired");
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(409).json("coupon already used");
    }

    req.body.coupon = coupon;
  }
  return res.json({ message: "success", cart });
};
