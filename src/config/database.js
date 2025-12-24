const mongoose= require("mongoose");

const connectDb= async ()=>{
    await mongoose.connect("mongodb+srv://codewithpranavtech_db_user:COSMICcompass17.@namasthenode.xjbenx1.mongodb.net/DILVIA")
}

module.exports=connectDb;