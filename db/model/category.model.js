import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
    {
        categoryName:{
            type: String,
            required: true,
            unique:true

        },
        image:{
            type:Object,
        },
        slug:{
            type:String,
            required:true
        },
        createdBy:{type:Types.ObjectId, ref:'User', required:false},
        updatedBy:{type:Types.ObjectId, ref:'User', required:false},
       

    },
    {
        timestamps:true

    }
)
const categoryModel = model('category',categorySchema);

export default categoryModel;
