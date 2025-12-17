  const express=require("express")

const app=express();


app.use("/user",(req,res,next)=>{
    console.log("middleware one running");
    next()
});

app.get("/user",(req,res,next)=>{
    console.log("middleware 2 running");
    next();
},

(req,res,next)=>{
res.send("Router working")
})
app.listen(3000,()=>{
    console.log("server running")
})