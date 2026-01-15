
// This function validates user signup data by checking that
// first name and last name are present, the email has a valid
// format, and the password meets strong security requirements.
// If any validation fails, it throws an error to stop signup.


const validator=require('validator');

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName|| !lastName){
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Paasword")
    }
};

// This function checks whether all fields sent in the request body
// are allowed to be edited. If even one field is not in the allowed
// list, the edit request will be rejected.

const validateEditProfileData =(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","gender","age","about","skills"]


const isEditAllowed=Object.keys(req.body).every((field)=>
    allowedEditFields.includes(field)
);
return isEditAllowed;
};

module.exports={
validateSignUpData,
validateEditProfileData
};