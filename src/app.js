const express=require("express");
require("./config/database");
const connectDb=require("./config/database")
const app= express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());


const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");


app.use('/',authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



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


