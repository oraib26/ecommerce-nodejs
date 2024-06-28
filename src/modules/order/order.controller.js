import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";
import { AppError } from "../../utls/AppError.js";

import Stripe from "stripe";
import createInvoice from "../../utls/pdf.js";
const stripe = new Stripe(process.env.sekStrip);

export const createOrder = async (req, res, next) => {
  //check carts
  const { couponName } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart || cart.products.length === 0) {
    return next(new AppError(`cart is empty`, 400));
  }
  req.body.products = cart.products;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new AppError(`coupon not found`, 404));
    }
    const currentDate = new Date();
    if (coupon.expireDate <= currentDate) {
      return next(new AppError(`this coupon has expried`, 400));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new AppError(`coupon already used`, 409));
    }
    req.body.coupon = coupon;
  }

  let subTotals = 0;
  let finalProductList = [];
  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });

    if (!checkProduct) {
      return next(new AppError(`product quantity not available`, 400));
    }
    product = product.toObject();
    product.name = checkProduct.name;
    product.unitPrice = checkProduct.price;
    product.discount = checkProduct.discount;
    product.finalPrice = product.quantity * checkProduct.finalPrice;
    subTotals += product.finalPrice;
    finalProductList.push(product);
  }

  const user = await userModel.findById(req.user._id);
  if (!req.body.Address) {
    req.body.Address = user.Address;
  }
  if (!req.body.phoneNumber) {
    req.body.phoneNumber = user.phoneNumber;
  }
  /*
  const session = await stripe.checkout.sessions.create({
    line_items: [
        {
        
          price_data:{
            currency:'USD',
            unit_amount:subTotals - (subTotals * (( req.body.coupon?.amount || 0 )) / 100),
            product_data:{
                name:user.userName
            }
          } ,
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `http://www.facebook.com`,
      cancel_url: `http://www.youtub.com`,
  })
  return res.json(session)
  */
  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
    Address: req.body.Address,
    phoneNumber: req.body.phoneNumber,
  });
  if (order) {
    const invoice = {
      shipping: {
        name: user.userName,
        address: order.Address,
        phone: order.phoneNumber,
      },
      items: order.products,
      subtotal: order.finalPrice,

      invoice_nr: order._id,
    };

    createInvoice(invoice, "invoice.pdf");

    for (const product of req.body.products) {
      await productModel.updateOne(
        { _id: product.productId },
        { $inc: { stock: -product.quantity } }
      );
    }

    if (req.body.coupon) {
      await couponModel.updateOne(
        { _id: req.body.coupon._id },
        { $addToSet: { usedBy: req.user._id } }
      );
    }

    await cartModel.updateOne(
      { userId: req.user._id },
      {
        products: [],
      }
    );
  }

  return res.status(201).json({ message: "success", order });
};

export const getallOrder = async (req, res) => {
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
export const getOrderUser = async (req, res) => {
  const order = await orderModel.find({ userId: req.user._id });
  return res.json({ message: "success", order });
};
export const changeStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new AppError(`order not found`, 404));
  }
  order.status = status;
  await order.save();
  return res.json({ message: "success", order });
};
