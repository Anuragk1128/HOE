import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    image:{type:Array,required:true},
    category:{type:String,required:true},
    stock:{type:Number,required:true},
    size:{type:Array,required:true},
    color:{type:Array,required:true},
    rating:{type:Number,required:true},
    reviews:{type:Array,required:true},
    isFeatured:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

const Product=mongoose.model("Product",productSchema);

export default Product;
