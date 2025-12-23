const express=require("express");
const app= express();
const {adminauth}=require("./middlwares/auth");

app.use("/admin",adminauth);

app.get("/user",(req,res)=>{
    res.send("userdatasend")
});
app.get("/admin",(req,res,next)=>{
    //res.send("alldatasend")
    next()
},
(req,res)=>{
    res.send(" all  date send")
}
)



app.listen(3000,()=>{
    console.log("server running")
}) 