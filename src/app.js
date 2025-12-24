const express=require("express");
require("./config/database");

const connectDb=require("./config/database")

const app= express();
const User=require("./models/user");

app.post("/signup",async(req,res)=>{
    const userObj={
        firstName:"MS",
        lastName:"Dhoni",
        emailId:"MSD@gmail.com",
        password:"Msd@123"
    }

const user=new User(userObj);
//CREATING A NEW INSTATNCE OF THE USER MODEL
await user.save();
//.save returns a promise hence we have to use async ,await
res.send("User Added Sucessfully")
});

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


