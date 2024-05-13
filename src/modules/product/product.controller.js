import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import procuctModel from "../../../db/model/product.model.js";
import subcategoryModel from "../../../db/model/subcategory.model.js";
import cloudinary from "../../utls/cloudinary.js";
import productModel from "../../../db/model/product.model.js";

export const create =async(req, res) => {
  const {productName, price, discount, categoryId, subCategoryId}=req.body;
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  const subCategory = await subcategoryModel.findOne({_id:subCategoryId, categoryId:categoryId});
  if (!subCategory) {
    return res.status(404).json({ message: "sub category not found" });
  }
  req.body.slug = slugify(productName);
  req.body.finalPrice = price - (( price * (discount || 0)) / 100)
  
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.STORENAME}/${productName}`,
    }
  );
  //return res.json(req.files)

  req.body.mainImage = { secure_url, public_id };
  req.body.subImages=[];

  for(const file of req.files.subImages){
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.subImages[0].path,
      {
        folder: `${process.env.STORENAME}/${productName}/subImages`,
      })
    req.body.subImages.push({ secure_url, public_id})
    

  }
  const product = await productModel.create(req.body);

  return res.status(201).json({message:"success", product})


    
  }