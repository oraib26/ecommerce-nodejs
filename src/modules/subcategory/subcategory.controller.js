import slugify from "slugify";
import subcategoryModel from "../../../db/model/subcategory.model.js";
import cloudinary from "../../utls/cloudinary.js";
import categoryModel from "../../../db/model/category.model.js";

export const create = async (req, res) => {
  
  const category = await categoryModel.findById(req.body.categoryId);

  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }

  req.body.subcategoryName = req.body.subcategoryName.toLowerCase();

  if (await subcategoryModel.findOne({ subcategoryName: req.body.subcategoryName })) {
    return res.status(409).json({ message: "subcategory is already exists" });
  }
  req.body.slug = slugify(req.body.subcategoryName);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.STORENAME}/subcategories`,
    }
  );

  req.body.image = { secure_url, public_id };

  req.body.createdBy= req.user._id;
  req.body.updatedBy= req.user._id;
  const subcategory = await subcategoryModel.create(req.body);

  return res.json({ message: subcategory });
};

export const getAll = async (req, res) => {
  const subcategories = await subcategoryModel.find({});
  return res.status(200).json({ message: "success", subcategories });
};

export const getActive = async (req, res) => {
  const subcategoriesActive = await subcategoryModel
    .find({ status: "active" })
    .select("subcategoryName");
  return res.status(200).json({ message: "success", subcategoriesActive });
};

export const getDetails = async (req, res) => {
  const { id } = req.params;
  const subcategory = await subcategoryModel.findById({ _id: id });
  return res.status(200).json({ message: "success", subcategory });
};

export const update = async (req, res) => {
  const subcategory = await subcategoryModel.findById(req.params.id);

  if (!subcategory) {
    return res.status(404).json({ message: "subcategory not found" });
  }
  //return res.json(req.body);

  subcategory.subcategoryName = req.body.subcategoryName.toLowerCase();

  if (
    await subcategoryModel.findOne({
      subcategoryName: req.body.subcategoryName,
      _id: { $ne: req.params.id },
    })
  ) {
    return res.status(409).json({ message: "subcategory already exists" });
  }
  //فوق فحصنا انه اسم الكاتيجوري الجديد مش موجود بالداتابيس قبل

  subcategory.slug = slugify(req.body.subcategoryName);

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.STORENAME}/subcategories`,
      }
    );
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    subcategory.image = { secure_url, public_id };

    subcategory.status = req.body.status;
    subcategory.updatedBy = req.user._id;

    await subcategory.save();

    return res.json({ message: "success", subcategory });
  }
};

export const destroy = async (req,res)=>{
  const subcategory = await subcategoryModel.findByIdAndDelete(req.params.id);

  if (!subcategory) {
    return res.status(404).json({ message: "subcategory not found" });
  }
  await cloudinary.uploader.destroy(subcategory.image.public_id);

  return res.status(200).json({mesaage:"success", subcategory})



}
