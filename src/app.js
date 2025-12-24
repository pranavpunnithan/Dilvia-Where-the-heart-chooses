const express=require("express");
const app= express();

app.get("/getdata",(req,res)=>{
    try{
   throw new Error("jhsbvigbdshv")
   res.status(500).send("something went wrong here")
    }catch(err){
        res.status(500).send("contact supoort team")
    }
})


app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
});
app.listen(3000,()=>{
    console.log("server running")
}) 