const express=require("express");
require("./config/database");

const connectDb=require("./config/database")

const app= express();


connectDb()
.then(()=>{
    console.log("Datebase connected sucessfully");
    app.listen(3000,()=>{
    console.log("server running")
}) 
})

.catch((err)=>{
    console.log("database cannot be connected")
})


