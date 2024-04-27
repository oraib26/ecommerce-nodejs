import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";

export const createCategory = async (req, res) => {
  req.body.categoryName = req.body.categoryName.toLowerCase();

  if (await categoryModel.findOne({ categoryName:req.body.categoryName })) {
    return res.status(409).json({ message: "Category is already exists" });
  }
  req.body.slug = slugify(req.body.categoryName);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "oshope5/categories",
    }
  );

  req.body.image = { secure_url, public_id };
  const category = await categoryModel.create(req.body);

  return res.json({message:category})
};
