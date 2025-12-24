const express=require("express");
const app= express();

app.get("/getdata",(req,res)=>{
    throw new Error("jhsbvigbdshv")
res.send("user data send")
})


app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
});
app.listen(3000,()=>{
    console.log("server running")
}) 