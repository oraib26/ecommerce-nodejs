import { response } from "express";
import cartModel from "../../../db/model/cart.model.js";
import couponModel from "../../../db/model/coupon.model.js";
import orderModel from "../../../db/model/order.model.js";
import productModel from "../../../db/model/product.model.js";
import userModel from "../../../db/model/user.model.js";

export const create = async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });

  // return res.json({cart})
  if (!cart || cart.products.length === 0) {
    return res.status(400).json("cart is empty");
  }
  //return res.json(cart);
  req.body.products = cart.products;
  //  return res.json( req.body.couponName);
  if (req.body.couponName) {
    const coupon = await couponModel.findOne({ name: req.body.couponName });
    //  return res.json(coupon);
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
  //return res.json(req.body.coupon);
  let finalProductList = [];
  let subTotal = 0;
  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: {
        $gte: product.quantity,
      },
    });
    if (!checkProduct) {
      return res.status(400).json("product quantity not available");
    }

    product = product.toObject();

    product.name = checkProduct.productName;
    product.untiPrice = checkProduct.price;
    product.discount = checkProduct.discount;
    product.finalPrice = product.quantity * checkProduct.finalPrice;
    subTotal += product.finalPrice;
    finalProductList.push(product);
  }
  const user = await userModel.findById(req.user._id);
  // return res.json(user)

  if (!req.body.address) {
    req.body.address = user.address;
  }

  if (!req.body.phone) {
    req.body.phone = user.phone;
  }
  // return res.json(user._id)

  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotal - subTotal * ((req.body.coupon?.amount || 0) / 100),
    address: req.body.address,
    phoneNumber: req.body.phone,
    updatedBy: req.user._id,
  });

  if (order) {
    for (const product of req.body.products) {
      await productModel.findOneAndUpdate(
        { _id: product.productId },
        {
          $inc: {
            stock: -product.quantity,
          },
        }
      );
    }
    if (req.body.coupon) {
      await couponModel.findOneAndUpdate(
        { _id: req.body.coupon._id },
        {
          $addToSet: {
            usedBy: req.user._id,
          },
        }
      );
    }
    await cartModel.updateOne(
      { userId: req.user._id },
      {
        products: [],
      }
    );
  }

  return res.json({ message: "success", order });
};

export const getOrders = async (req, res) => {
  const orders = await orderModel.find({
    $or: [
      {
        status: "pending",
      },
      {
        status: "confirmed",
      },
    ],
  });

  return res.json({ message: "success", orders });
};

export const getUserOrders = async (req, res) => {
  const order = await orderModel.find({ userId: req.user._id });

  return res.json({ message: "success", order });
};

export const changeStatus = async (req, res) => {
  const { status,orderId } = req.body;
  //const { orderId } = req.params; 
  //when i user req.params displays message "page not found " in postman , i try to handle this error but ..  :()
  const order = await orderModel.findOneAndUpdate({_id: orderId},{
    status : status
  },{ new: true })
  if(!order){
    return res.status(400).json({message:"order not found"})
  }

  return res.status(200).json({message:"success",order})
};
