const adminauth= (req,res,next)=>{
     console.log("auth auth checking")
    const token="xyz";
    const auth=token==="xyz";
    if(!auth){
     res.status(401).send("unauthorised request")
    
    }
    else{
     next()
    }
};
module.exports={
    adminauth,
}