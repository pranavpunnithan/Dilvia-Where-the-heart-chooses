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
      const isPasswordValid= await bcrypt.compare(password,user.password);
      if(isPasswordValid){
        //create a JWT token  npm i jsonwebtoken before that cookie-parser
     const token =await jwt.sign({_id:user._id},"Tinter@web$110");
     console.log(token);

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




//get user by email

app.get("/users", async(req,res)=>{
    const userEmail= req.body.emailId;

try{
    const users=await User.find({emailId:userEmail});
    if(users.length===0){
        res.status(404).send("User not found")
    }
    res.send(users);
 }
 catch(err){
    res.status(400).send("Something went wrong")
 }
});
/*
PROCESS FLOW:

1. Client (Postman / Frontend) sends a request to the server.

2. SIGNUP API (/signup):
   - A POST request is sent with user details in req.body.
   - A new User model instance is created using req.body.
   - The data is saved into MongoDB using user.save().
   - If saving is successful, a success message is sent.
   - If any error occurs, a 400 error response is returned.

3. GET USER BY EMAIL API (/users):
   - A GET request is sent to fetch user data.
   - The emailId is read from req.body.
   - User.find() queries the MongoDB database and checks
     whether any document matches the given emailId.
   - If no matching user is found, a 404 "User not found" response is sent.
   - If user data exists, the matching user details are returned.
   - If any unexpected error occurs, a 400 error response is sent.

NOTE:
- User is a Mongoose model that acts as a bridge between the server
  and the MongoDB users collection.
- MongoDB stores the actual data; the model is used only to query it.
- Only one response is sent per request using return when needed.
*/

app.get("/profile",async(req,res)=>{
    try{
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodeMessage=await jwt.verify(token,"Tinter@web$110");
        const{_id}=decodeMessage;
        console.log("Logged In user isL:" + _id);
        const user= await User.findById(_id);
        if(!user){
            throw new Error("User doesnt exist");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
})
/*
This route handles fetching the logged-in user's profile information.

1) When a client (browser/Postman) hits GET /profile, it automatically sends cookies along with the request.
   These cookies were previously set during login using res.cookie("token", token).

2) req.cookies contains all cookies sent by the client.
   From that object, we extract the JWT token stored under the key "token".

3) If the token is not present, it means:
   - User is not logged in
   - OR cookie was cleared/expired
   So we throw an error saying the token is invalid.

4) jwt.verify() checks whether the token is real and untampered.
   - It uses the SAME secret key that was used during jwt.sign() in login.
   - If the token is fake, expired, or modified, verification fails.

5) If verification succeeds, jwt.verify() returns the payload.
   In our case, the payload contains the user’s MongoDB _id.

6) We extract _id from the decoded token.
   This _id uniquely identifies the logged-in user in the database.

7) Using this _id, we query MongoDB to fetch the user document.
   This ensures the user still exists in the database.

8) If no user is found, it means:
   - The user account was deleted
   - Or the token is referencing an invalid user
   So we throw an error.

9) If everything is valid, we send the user data as the response.

10) Any error at any step is caught in the catch block,
    and an error response is sent back to the client.
*/


app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("something went wrong")
    }
})
//find{} is used to filter all the data in database


//delete a user from database
app.delete("/user", async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user= await User.findByIdAndDelete(userId)
        res.send("User Deleted Sucessfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});
//Update data of the user
app.patch("/user/:userId", async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;

        
        try{
            
    const ALLOWED_UPDATES=[
        "about","gender","age"
    ]

    const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        await User.findByIdAndUpdate({_id:userId},data,
        {runValidators:true});
        res.send("User updated sucessfully")
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});
// PATCH API to update user details partially

// Route: /user/:userId
// Method: PATCH

// userId is taken from route params
// It is used only to identify which user to update
// userId is NOT updated in the database

// req.body contains only the fields the client wants to update
// Example request body: { age: 26, about: "Backend dev" }

// Wrap database logic in try-catch to handle errors safely

// ALLOWED_UPDATES defines which fields are allowed to be modified
// This prevents updating sensitive fields like password, email, _id

// Object.keys(data) extracts only the fields sent by the client
// every() checks that ALL fields are present in ALLOWED_UPDATES
// key represents one field name at a time from req.body

// If any field is not allowed, throw an error
// This immediately blocks unauthorized updates

// findByIdAndUpdate uses userId to locate the user document
// data is used as the update object
// runValidators ensures schema validation rules are applied

// If update succeeds, send a success response to the client

// catch block handles validation errors or database failures
// Sends a 400 status to avoid crashing the server
//npm installed validator


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


