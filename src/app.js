const express=require("express");
require("./config/database");

const connectDb=require("./config/database")

const app= express();
const User=require("./models/user");
app.use(express.json());
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const validator=require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const {userAuth}=require("./middlwares/auth")
app.post("/signup",async(req,res)=>{

try{
//validation of the data
validateSignUpData(req);

//encrypt the password(BCRYPT IS USED)
const {firstName,lastName,emailId,password}=req.body;
const passwordHash=await bcrypt.hash(password,10);
console.log(passwordHash);

   

const user=new User({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
});
//CREATING A NEW INSTATNCE OF THE USER MODEL and through req.body it is taking the input from api and adding it to database

await user.save();
//.save returns a promise hence we have to use async ,await
res.send("User Added Sucessfully")
}
catch(err){
    res.status(400).send("Error saving the user:" + err.message);
} 
}); 


//login
/* %!!
Login API to authenticate an existing user

Read emailId and password sent from the client in the request body

Check whether emailId or password is missing

Stop execution if required fields are not provided

Validate the email format to ensure it is correct

Query the database to find a user with the given emailId

Explicitly include the password field since it is excluded by default

Stop login process if the user does not exist

Compare the entered plain-text password with the hashed password from the database

Allow login only if the password comparison is successful

Create a JWT token using the user's unique MongoDB _id as payload

Sign the token using a secret key to prevent tampering or forgery

Log the generated token for debugging purposes (development only)

Store the JWT token in a browser cookie for authentication

Send a success response after successful login

Reject the login attempt if the password is incorrect

Catch any error that occurs during validation or authentication

Send an error response with status code 400 and the error message
!!%*/
app.post("/login",async(req,res)=>{
    try{
   
     const {emailId,password} =req.body;

      if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

      if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
      const user=await User.findOne({emailId:emailId}).select("+password");
      if(!user){
        throw new Error("Invalid credentails");
      } 
      const isPasswordValid= await user.validatePassword(password);
      if(isPasswordValid){
        //create a JWT token  npm i jsonwebtoken before that cookie-parser
        const token =await user.getJWT();

     //Add the token to cookie and send the response back to the user
     res.cookie("token",token);
     res.send("Login Sucessful")
      }else{
        throw new Error("Invalid credential");
      }

    }catch(err){
    res.status(400).send("Error saving the user:" + err.message);    
    }
})

app.get("/profile",userAuth,async(req,res)=>{
    try{
      const user=req.user
        res.send(user);
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user=req.user;
    //sending a connection request
    res.send(user.firstName +"send the connection request");
})



connectDb()
.then(()=>{
    console.log("Datebase connected sucessfully");
    app.listen(3000,()=>{
    console.log("server running")
});
})

.catch((err)=>{
    console.log("database cannot be connected")
}); 


