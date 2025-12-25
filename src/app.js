const express=require("express");
require("./config/database");

const connectDb=require("./config/database")

const app= express();
const User=require("./models/user");
app.use(express.json());

app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const userObj={
        firstName:"MS",
        lastName:"Dhoni",
        emailId:"MSD@gmail.com",
        password:"Msd@123"
    }

const user=new User(userObj);
//CREATING A NEW INSTATNCE OF THE USER MODEL

try{
await user.save();
//.save returns a promise hence we have to use async ,await
res.send("User Added Sucessfully")
}
catch(err){
    res.status(400).send("Error saving the user:" + err.message);
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


