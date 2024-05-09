import userModel from "../../../db/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendeEmail } from "../../utls/email.js";
export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "email already exists" });
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALTROUND)
  );
  const addUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });

  await sendeEmail(email,'Welcome',`<h2> Hello Ya ${userName} :)</h2>`)

  return res.status(201).json({ message: "success", user: addUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({email});
  if(!user){
    return res.status(400).json({message:"invalid data"});
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match){
    return res.status(400).json({message:"invalid data"});
  }
  const token = jwt.sign({id:user._id, role:user.role, status:user.status},process.env.LOGINSIG)

  return res.status(200).json({message:"success",token})
};
