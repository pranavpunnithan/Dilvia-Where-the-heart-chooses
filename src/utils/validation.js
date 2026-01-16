
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



// This function validates profile edit requests
// It checks:
// 1) Whether the user is trying to edit only allowed fields (security check)
// 2) Whether the values provided for those fields are valid (data validation)
const validateEditProfileData = (req) => {

    // List of fields that a user is allowed to update via profile edit
    // Any field outside this list should be rejected immediately
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "gender",
        "age",
        "about",
        "skills"
    ];

    // STEP 1: FIELD WHITELIST CHECK
    // Object.keys(req.body) gets all field names sent from frontend
    // .every() ensures ALL fields are present in allowedEditFields
    // If even one field is not allowed, isEditAllowed becomes false
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    // Early exit:
    // If the user tries to update any disallowed field (like password, role, etc.),
    // stop execution immediately and return false.
    // The route handler will catch this and reject the request.
    if (!isEditAllowed) return false;

    // STEP 2: FIELD-VALUE VALIDATION
    // Each validation runs ONLY if that field exists in req.body

    // Validate firstName length
    if (req.body.firstName && req.body.firstName.length < 2) {
        throw new Error("First name must be at least 2 characters");
    }

    // Validate lastName length
    if (req.body.lastName && req.body.lastName.length < 2) {
        throw new Error("Last name must be at least 2 characters");
    }

    // Validate email format using validator library
    if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
        throw new Error("Invalid email");
    }

    // Validate gender to allow only specific values
    if (req.body.gender && !["male", "female", "others"].includes(req.body.gender)) {
        throw new Error("Invalid gender");
    }

    // Validate age range
    // Ensures age is within allowed business rules
    if (req.body.age && (req.body.age < 18 || req.body.age > 45)) {
        throw new Error("Age must be between 18 and 45");
    }

    // Validate about section length
    if (req.body.about && req.body.about.length > 200) {
        throw new Error("About can be max 200 characters");
    }

    // Validate skills field
    if (req.body.skills) {
        // Skills must be an array
        if (!Array.isArray(req.body.skills)) {
            throw new Error("Skills must be an array");
        }
        // Limit number of skills
        if (req.body.skills.length > 15) {
            throw new Error("Max 15 skills allowed");
        }
    }

    // If all checks pass:
    // - Fields are allowed
    // - Values are valid
    // Return true so the route can proceed with updating and saving the profile
    return isEditAllowed;
};

//password validation
const validateChangePasswordData=(req)=>{
    const {oldPassword,newPassword}=req.body;
    if(!oldPassword||!newPassword) return false;
    if(newPassword.length<6){
        throw new Error("Password must be at least 6 characters");
    }
    if(oldPassword===newPassword){
        throw new Error("New password must be different");
    }
    return true 
}



module.exports={
validateSignUpData,
validateEditProfileData,
validateChangePasswordData
};