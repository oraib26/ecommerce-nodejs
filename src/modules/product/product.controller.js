import slugify from "slugify";
import cloudinary from "../../utls/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import { AppError } from "../../utls/AppError.js";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import productModel from "../../../DB/model/product.model.js";

export const createProduct = async (req, res, next) => {
  const { name, price, discount, categoryId, subcategoryId } = req.body;
  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory) {
    return next(new AppError(`category not found`, 404));
  }
  const checkSubCategory = await subcategoryModel.findById(subcategoryId);
  if (req.body.subcategoryId) {
    if (!checkSubCategory) {
      return next(new AppError(`subcategory not found`, 404));
    }
  }

  req.body.slug = slugify(name);
  req.body.finalPrice = price - ((price * (discount || 0)) / 100).toFixed(2);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImages` }
  );
  req.body.mainImage = { secure_url, public_id };
  req.body.subImages = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/product/${req.body.name}/subimages` }
    );
    req.body.subImages.push({ secure_url, public_id });
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new AppError(`error while creating product`, 400));
  }
  return res.status(201).json({ message: "success", product });
};
export const getproduct = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /gt|gte|lt|lte|in|nin|eq/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);
  const moongoseQuery = productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    });
  if (req.query.search) {
    moongoseQuery.find({
      $or: [
        { name: { $regex: req.query.search } },
        { description: { $regex: req.query.search } },
      ],
    });
  }

  const count = await productModel.estimatedDocumentCount();
  moongoseQuery.select(req.query.fields);
  let products = await moongoseQuery.sort(req.query.sort);

  products = products.map((product) => {
    return {
      ...product.toObject(),
      mainImage: product.mainImage.secure_url,
      subImages: product.subImages.map((img) => img.secure_url),
    };
  });

  return res.status(200).json({ message: "success", count, products });
};
