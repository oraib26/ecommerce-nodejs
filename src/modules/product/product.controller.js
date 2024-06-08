import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import subcategoryModel from "../../../db/model/subcategory.model.js";
import cloudinary from "../../utls/cloudinary.js";
import productModel from "../../../db/model/product.model.js";
import { pagination } from "../../../src/utls/pagination.js";

export const create = async (req, res) => {
  const { productName, price, discount, categoryId, subCategoryId } = req.body;
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  const subCategory = await subcategoryModel.findOne({
    _id: subCategoryId,
    categoryId: categoryId,
  });
  if (!subCategory) {
    return res.status(404).json({ message: "sub category not found" });
  }
  req.body.slug = slugify(productName);
  req.body.finalPrice = price - (price * (discount || 0)) / 100;

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.STORENAME}/${productName}`,
    }
  );
  //return res.json(req.files)

  req.body.mainImage = { secure_url, public_id };
  req.body.subImages = [];

  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.subImages[0].path,
      {
        folder: `${process.env.STORENAME}/${productName}/subImages`,
      }
    );
    req.body.subImages.push({ secure_url, public_id });
  }
  const product = await productModel.create(req.body);

  return res.status(201).json({ message: "success", product });
};

export const getAll = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  let queryObj = { ...req.query };

  const execQuery = ["page", "limit", "sort", "search", "fields"];

  execQuery.map((ele) => {
    delete queryObj[ele];
  });

  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /gt|gte|It|Ite|in|nin|eq/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);
  const mongoseQuery = await productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit);

  /* .populate({
    path: 'reviews',
    populate:{
      path: 'userId',
      select:'userName -_id'
    }
  }).select('productName');*/

  if (req.query.search) {
    mongoseQuery.find({
      $or: [
        { name: { $regex: req.query.search } },
        { description: { $regex: req.query.search } },
      ],
    });
  }

  const count = await productModel.estimatedDocumentCount();
  mongoseQuery.select(req.query.fields);

  const products = await mongoseQuery.sort(req.query.sort);

  return res.status(200).json({ message: "success", count, products });
};
