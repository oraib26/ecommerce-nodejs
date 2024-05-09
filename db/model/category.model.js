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
        status:{
            type:String,
            default:"not active"
                

        },
        createdBy:{type:Types.ObjectId, ref:'User', required:false},
        updatedBy:{type:Types.ObjectId, ref:'User', required:false},
       

    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}

    }
)
categorySchema.virtual("subcategory",{
    localField:"_id",
    foreignField:"categoryId",
    ref:"Subcategory"
})
const categoryModel = model('Category',categorySchema);

export default categoryModel;
