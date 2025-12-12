const express=require("express")

const app=express();

app.use("/test",(req,res)=>{
    res.end("hello namasthe server")
})

app.get("/use/:id",(req,res)=>{
    console.log(req.params);
    res.send(`your id is ${req.params.id}`)
})

app.get("/search",(req,res)=>{
    console.log(req.query);
    res.send(req.query)
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

app.get(/a/,(req,res)=>{
   res.send("chck the a") 
})
app.listen(3000,()=>{
    console.log("server running")
})