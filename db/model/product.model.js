import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
    {
        productName:{
            type: String,
            required: true,
            unique:true,
            trem:true

        },
        slug:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            default:1

        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        discount:{
            type:Number,
            default:0
        },
        finalPrice:{
            type:Number,

        },

        mainImage:{
            type:Object,
            required:true
        },
        subImages:[{
            type:Object,
            required:true

        }],
        sizes:[{
            type:String,
            enum:['s','m','lg','xl']
        }],
        colors:[{ type:String}],
       
        status:{
            type:String,
            default:"not active"
                

        },
        categoryId:{
            type:Types.ObjectId,
            ref:"Category",
            required:true
        },
        subCategoryId:{
            type:Types.ObjectId,
            ref:"Subcategory",
            required:true

        },
        createdBy:{type:Types.ObjectId, ref:'User', required:false},
        updatedBy:{type:Types.ObjectId, ref:'User', required:false},
       

    },
    {
        timestamps:true,

    }
)
const productModel = model('Product',productSchema);

export default productModel;
