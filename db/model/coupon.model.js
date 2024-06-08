import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    usedBy: [
      
         {
          type: Types.ObjectId,
          ref: "User",
          required: true,
          unique: true,
         },
      
    ],

    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Types.ObjectId,
    },
    expireDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = model("Coupon", couponSchema);

export default couponModel;
