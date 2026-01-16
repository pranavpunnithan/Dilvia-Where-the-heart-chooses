const express= require("express");
const profileRouter= express.Router();

const bcrypt = require("bcrypt");
const {userAuth}=require("../middlwares/auth");
const {validateEditProfileData}=require("../utils/validation");
const {validateChangePasswordData} = require("../utils/validation");
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
      const user=req.user
        res.send(user);
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser=req.user;
         //this is the same user data from the auth.js which is taking from user  
        // req.user contains the authenticated user's data.
        // This user object is attached in the userAuth middleware
       // after verifying the JWT token and fetching the user from the database.
      // So loggedInUser represents the currently logged-in user making this request.

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
         await loggedInUser.save();
        res.send(`${loggedInUser.firstName},your profile updated sucessfully`);
    }catch(err){
        res.status(400).send("Error:"+ err.message);
    }
});

profileRouter.patch("/profile/changepassword",userAuth,async(req,res)=>{
    try{
        if(!validateChangePasswordData(req)){
          throw new Error("Invalid password change request");  
        }

        const loggedInUser=req.user;
        console.log("oldPassword =", req.body.oldPassword);
        console.log("dbPassword =", loggedInUser.password);

        const isMatch=await bcrypt.compare(
            req.body.oldPassword,
            loggedInUser.password
        );
        if(!isMatch){
            throw new Error("Old password is incorrect");
        }

        //hash and save new password
        loggedInUser.password= await bcrypt.hash(req.body.newPassword,10);
        await loggedInUser.save();
        res.send("Password updated sucessfully");
    }catch (err) {
    res.status(400).send("Error: " + err.message);
  }
})


module.exports=profileRouter;
