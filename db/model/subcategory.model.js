import mongoose, { Schema, Types, model } from "mongoose";

const subcategorySchema = new Schema(
    {
        subcategoryName:{
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
        status:{
            type:String,
            default:"not active"
                

        },
        categoryId:{
            type:Types.ObjectId,
            ref:"Category",
            required:true
        },
        createdBy:{type:Types.ObjectId, ref:'User', required:false},
        updatedBy:{type:Types.ObjectId, ref:'User', required:false},
       

    },
    {
        timestamps:true

    }
)
const subcategoryModel = model('Subcategory',subcategorySchema);

export default subcategoryModel;
