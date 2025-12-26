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


