const express=require("express");
require("./config/database");

const connectDb=require("./config/database")

const app= express();
const User=require("./models/user");
app.use(express.json());

app.post("/signup",async(req,res)=>{
   

const user=new User(req.body);
//CREATING A NEW INSTATNCE OF THE USER MODEL and through req.body it is taking the input from api and adding it to database

try{
await user.save();
//.save returns a promise hence we have to use async ,await
res.send("User Added Sucessfully")
}
catch(err){
    res.status(400).send("Error saving the user:" + err.message);
} 
}); 

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
app.patch("/user", async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        await User.findByIdAndUpdate({_id:userId},data);
        res.send("User updated sucessfully")
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});
//Update data of the user using gmail
app.patch("/userx", async(req,res)=>{
    const emailId=req.body.emailId;
    const data=req.body;
    try{
        await User.findOneAndUpdate({emailId:emailId},data);
        res.send("User updated sucessfully")
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

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


