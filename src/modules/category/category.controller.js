import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";

export const create = async (req, res) => {

  req.body.categoryName = req.body.categoryName.toLowerCase();

  if (await categoryModel.findOne({ categoryName: req.body.categoryName })) {
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

  req.body.createdBy= req.user._id;
  req.body.updatedBy= req.user._id;
  const category = await categoryModel.create(req.body);

  return res.json({ message: category });
};

export const getAll = async (req, res) => {
  const categories = await categoryModel.find({});
  return res.status(200).json({ message: "success", categories });
};

export const getActive = async (req, res) => {
  const categoriesActive = await categoryModel
    .find({ status: "active" })
    .select("categoryName");
  return res.status(200).json({ message: "success", categoriesActive });
};

export const getDetails = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById({ _id: id });
  return res.status(200).json({ message: "success", category });
};

export const update = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  //return res.json(req.body);

  category.categoryName = req.body.categoryName.toLowerCase();

  if (
    await categoryModel.findOne({
      categoryName: req.body.categoryName,
      _id: { $ne: req.params.id },
    })
  ) {
    return res.status(409).json({ message: "category already exists" });
  }
  //فوق فحصنا انه اسم الكاتيجوري الجديد مش موجود بالداتابيس قبل

  category.slug = slugify(req.body.categoryName);

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "oshope5/categories",
      }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };

    category.status = req.body.status;
    category.updatedBy = req.user._id;

    await category.save();

    return res.json({ message: "success", category });
  }
};

export const destroy = async (req,res)=>{
  const category = await categoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  await cloudinary.uploader.destroy(category.image.public_id);

  return res.status(200).json({mesaage:"success", category})



}
