import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    mrp:{type:Number,required:true}, // Original MRP price
    discountPercentage:{type:Number,default:0,min:0,max:100}, // Discount percentage (0-100)
    description:{type:String,required:true},
    image:{type:Array,required:true},
    category:{type:String,required:true},
    subcategory:{type:String,required:true},
    brand:{type:String,required:true},
    gender:{type:String,required:true,enum:['male','female','unisex']},
    stock:{type:Number,required:true},
    size:{type:Array,required:false},
    color:{type:Array,required:false},
    rating:{type:Number,required:true},
    reviews:{type:Array,required:true},
    isFeatured:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
    // Jewellery specific attributes
    jewelleryAttributes:{
        metalType:{type:String},
        purity:{type:String},
        stoneType:{type:String},
        stoneQuality:{type:String},
        weight:{type:Number}, // in grams
        designStyle:{type:String},
    },
    // Sportswear specific attributes
    sportswearAttributes:{
        material:{type:String},
        fitType:{type:String},
        activityType:{type:String},
    },
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

const Product=mongoose.model("Product",productSchema);

export default Product;
