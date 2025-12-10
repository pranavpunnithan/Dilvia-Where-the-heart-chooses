const express=require("express")

const app=express();

app.use("/test",(req,res)=>{
    res.end("hello namasthe server")
})

app.use((req,res)=>{
    res.end("hello world")
});

app.listen(3000,()=>{
    console.log("server running")
})