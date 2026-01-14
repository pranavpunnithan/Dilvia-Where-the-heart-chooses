const express= require("express");
const requestrouter=express.Router();
const {userAuth}=require("../middlwares/auth")

requestrouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user=req.user;
    //sending a connection request
    res.send(user.firstName +"send the connection request");
})

module.exports=requestrouter;