import couponModel from "../../../DB/model/coupon.model.js";
import { AppError } from "../../utls/AppError.js";

export const createCoupon=async(req,res,next)=>{
    const {name,amount}=req.body;
    if(await couponModel.findOne({name})){
        return next(new AppError(`coupon ${name} already exist`, 409 ));
     
    }
   req.body.expireDate=new Date(req.body.expireDate);
   const coupon= await couponModel.create(req.body);
   return res.status(201).json({message:"success",coupon});
}