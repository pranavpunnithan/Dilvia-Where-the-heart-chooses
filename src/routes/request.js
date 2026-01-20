const express= require("express");
const mongoose = require("mongoose");
const requestrouter=express.Router();
const {userAuth}=require("../middlwares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user");

requestrouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
     
     //To only allow allowable things to input under status api
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid Status Type"+ status});
        }
       
        //To check whether user is there in db or not
     const toUser= await User.findById(toUserId);
     if(!toUser){
        return res.status(404).json({message:"User not found"});
     }

        //if there is an existing ConnectionRequest
       const existingConnectionRequest= await ConnectionRequest.findOne({
        $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId},
        ],
        });
        if(existingConnectionRequest){
            return res.status(404).send("User Not found");
        }

        const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        })
    
      const data=await connectionRequest.save();
      res.json({
      message: `${req.user.firstName} has ${status} the request from ${toUser.firstName}`
      });

    
    }catch(err){
        res.status(400).send("Error"+ err.message);
    }
});

requestrouter.post("/request/review/:status/:requestId",
    userAuth, async (req,res)=>{
        try{
         const loggedInUser=req.user;
         const{status,requestId}=req.params;
         const allowedStatus=["accepted","rejected"];
         if(!allowedStatus.includes(status)){
            return res.status(400).json({mesage:"Status not allowed"});
         }
         const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
         });
         if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
         }
         connectionRequest.status=status;
         const data =await connectionRequest.save();
         res.json({message:"Connection request "+ status,data});
        }catch(err){
        res.status(400).send("Error"+ err.message);
    }
});





module.exports=requestrouter;