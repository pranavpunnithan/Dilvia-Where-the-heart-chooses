// Import the jsonwebtoken package to verify JWT tokens
// const jwt = require("jsonwebtoken");

// Import the User model to access users collection in MongoDB
// const User = require("../models/user");

// Create authentication middleware function
// This middleware runs before protected routes
// const userAuth = async (req, res, next) => {

//   try { // Start of try block to handle all possible errors

//     // Read token from cookies object
//     // cookie-parser middleware already added cookies into req.cookies
//     const { token } = req.cookies;

//     // If token is not present, user is not logged in
//     if (!token) {

//       // Manually throw error to stop execution
//       throw new Error("Token is not valid");
//     }

//     // Verify JWT token using secret key
//     // If token is fake or expired, jwt.verify will throw error
//     const decodedobj = await jwt.verify(token, "Tinter@web$110");

//     // Extract user id from decoded token payload
//     const { _id } = decodedobj;

//     // Find user in MongoDB using extracted id
//     // This checks if user still exists in database
//     const user = await User.findById(_id);

//     // If user not found in DB, block access
//     if (!user) {

//       // Throw error so catch block will handle it
//       throw new Error("User Not Found");
//     }

//     // Attach user data to request object
//     // So next route or controller can use req.user
//     req.user = user;

//     // Pass request to next middleware or route controller
//     next();

//   } catch (err) { // Catch block runs if ANY error occurs above

//     // Send error response to client
//     // err.message contains actual error message
//     res.status(400).send("Error: " + err.message);
//   }
// };

// Export middleware so it can be used in route files
// module.exports = {

//   // Exporting userAuth function
//   userAuth,
// };


const jwt= require("jsonwebtoken");
const User=require("../models/user");

const userAuth=async(req,res,next)=>{
    try{
    //Read token from req.cookies
     const {token}=req.cookies;
     if(!token){
        throw new Error("Token is not valid");
     }
     const decodedobj=await jwt.verify(token,"Tinter@web$110");

     const {_id}= decodedobj;

     const user= await User.findById(_id).select("+password");
     if(!user){
        throw new Error("User Not Found");
     }
     req.user=user;
     next()

    }catch(err){
    res.status(400).send("Error:" + err.message);
    }
};
module.exports={
    userAuth,
}
