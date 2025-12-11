const express=require("express")

const app=express();

app.use("/test",(req,res)=>{
    res.end("hello namasthe server")
})


app.get("/user",(req,res)=>{
    res.send({firstname:"Akshai",Lastname:"Saini"})
})

app.post("/user",(req,res)=>{
    res.send("data saved sucessfully")
})

app.delete("/user",(req,res)=>{
   res.send("data deleted sucessfully") 
})
app.listen(3000,()=>{
    console.log("server running")
})