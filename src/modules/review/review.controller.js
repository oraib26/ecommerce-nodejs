import orderModel from "../../../db/model/order.model.js";
import reviewModel from "../../../db/model/review.model.js";
import cloudinary from "../../utls/cloudinary.js";

export const create = async (req, res) => {
  const { productId } = req.params;

  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });

  if (!order) {
    return res.status(400).json({ message: "can not review this product" });
  }

  const checkReview = await reviewModel.findOne({
    userId: req.user._id,
    productId: productId,
  });

  if (checkReview) {
    return res.status(409).json({ message: "already reviewed this product" });
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.STORENAME}/${productId}/reviews`,
      }
    );
    req.body.image = { secure_url, public_id };
  }

  const review = await reviewModel.create({
    comment,
    rating,
    productId: productId,
    userId: req.user._id,
    image: req.body.image,
  });
  return res.json({message: 'success', review});
};
