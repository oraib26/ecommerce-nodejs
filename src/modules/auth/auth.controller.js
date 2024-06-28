import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
import { sendEmail } from "../../utls/sendEmail.js";
import { customAlphabet } from 'nanoid'
import xlsx from "xlsx";
import { AppError } from "../../utls/AppError.js";


export const getUsers = async(req,res,next)=>{
    
  return res.json(req.user);
}
export const signUp = async(req,res,next)=>{

  const {userName,email,password} = req.body;
  const hashedPassword=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
  
const token= jwt.sign({email},process.env.CONFIRMEMAILSECRET);
const createUser = await userModel.create({ userName, email, password: hashedPassword });
if (!createUser) {
  return next(new AppError(`error while creat user`,400));
  
}
await sendEmail(email, `welcome`,userName,token)
return res.status(201).json({ message: "success",user:createUser });

}
export const addUserExcel=async(req,res)=>{
const workbook=xlsx.readFile(req.file.path);
const worksheet=workbook.Sheets[workbook.SheetNames[0]];
const users=xlsx.utils.sheet_to_json(worksheet);
await userModel.insertMany(users);
return res.status(200).json(users);
}
export const confirmEmail = async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token,process.env.CONFIRMEMAILSECRET);
 await userModel.findOneAndUpdate({email:decoded.email},{confirmEmail: true }
    );
 return res.json({message:"success"})


}
export const signIn = async(req,res,next)=>{
  const {email,password} = req.body;
  const user = await userModel.findOne({email});
  if(!user){
    return next(new AppError(`email not found`,404));
  }

  if(!user.confirmEmail){
    return next(new AppError(`plz confirm your email`,400));
   

  }
  const match = await bcrypt.compare(password,user.password);
  if(!match){
    return next(new AppError(`Invalid Pssword`,400));
     

  }

  const token = jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET
      ,{expiresIn:'1h'}
      );

  const refreshToken = jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET,
      {expiresIn:60*60*24*30})
      
  return res.status(200).json({message:"success",token,refreshToken});
}
export const sendCode = async(req,res,next)=>{ 
  const {email} = req.body;
  let code = customAlphabet('1234567890abcdzABCDZ', 4)
  code =code();
  const user = await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});
  const html = `<h2>code is : ${code} </h2> `
  await sendEmail(email,`reset password`,html);
  return res.redirect(process.env.FORGOTPASSWORDFROM)
}
export const forgotPassword = async(req,res,next)=>{
  const {email,password,code} = req.body;
  const user = await userModel.findOne({email});
  if(!user){
    return next(new AppError(`not register account`,409));
     
  }
  if(user.sendCode != code){
    return next(new AppError(`invalid code`,400));
     
  }
  let match = await bcrypt.compare(password,user.password);
  if(match){
    return next(new AppError(`same password`,400));
  }
  user.password = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
  user.sendCode=null;
  user.changePasswordTime=Date.now();
  await user.save();
  return res.status(200).json({message:"success"});
}
export const deleteInvalidConfirm = async(req,res,next)=>{

  const users = await userModel.deleteMany({confirmEmail:false});

  return res.status(200).json({message:"success"});
}