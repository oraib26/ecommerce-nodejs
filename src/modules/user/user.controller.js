import userModel from "../../../db/model/user.model.js"


export const getUsers = async(req, res)=>{

    const users = await userModel.find({});

    return res.json({message:"success",users})

}

export const getUserData = async(req, res)=>{
    const user = await userModel.findById(req.user._id);
    if(!user){
        return res.json({message:"user not found"})
    }

    return res.status(200).json({message:"success",user})
}