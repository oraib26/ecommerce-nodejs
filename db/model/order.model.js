import mongoose, { Schema, model, Types } from "mongoose";
const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
        productName: { type: String },
      },
    ],
    finalPrice: {
      type: Number,
      required: true,
    },
    Address: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    paymentType: {
      type: String,
      default: "cash",
      enum: ["cart", "cash"],
    },
    couponName: {
      type: String,
      requierd: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "confirmed", "onWay", "deliverd"],
    },
    Rejectedreason: { type: String },
    notes: { type: String },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
