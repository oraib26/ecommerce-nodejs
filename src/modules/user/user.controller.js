import userModel from "../../../DB/model/user.model.js";

export const getAllUser = async (req, res) => {
  const users = await userModel.find({});
  return res.status(200).json({ message: "success", users });
};
export const getDateUser = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  return res.status(200).json({ message: "success", user });
};
