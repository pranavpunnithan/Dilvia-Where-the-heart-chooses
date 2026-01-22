const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    minLength: 4,     // Built-in validator: minimum 4 characters required
    maxLength: 50     // Built-in validator: maximum 50 characters allowed
  },

  lastName: {
    type: String
  },

  emailId: {
    type: String,
    lowercase: true,  // Sanitizer: converts email to lowercase before saving
    required: true,
    unique: true, //to put an index on email(indexing)
    trim: true,       // Sanitizer: removes extra spaces
    unique:true, //In MongoDB, unique: true creates a unique index, which both improves query performance and enforces data integrity by preventing duplicate values.

    // Custom validator: checks if email format is valid
    validate(value) {
      // value = email entered by the user
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    }
  },

  password: {
    type: String,
    required: true,
    select: false,    // Prevents password from being returned in queries

    // Custom validator: enforces strong password rules
    validate(value) {
      // value = password entered by the user
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a Strong Password");
      }
    }
  },

  age: {
    type: Number,
    min: 18,          // Built-in validator: minimum age allowed
    max: 45           // Built-in validator: maximum age allowed
  },

  gender: {
    type: String,

    // Custom validator: restricts gender to allowed values
    validate(value) {
      // value = gender entered by the user
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    }
  },

  about: {
    type: String,
    default: "This is a default about of the user"
  },

  skills: {
    type: [
      {
        type: String,
        trim: true,    // Sanitizer: removes spaces from each skill
        maxlength: 10  // Built-in validator: max 10 characters per skill
      }
    ],

    // Custom validator: limits total number of skills in the array
    validate: {
      // v = complete skills array
      validator: v => v.length <= 15,
      // Error shown when more than 15 skills are provided
      message: "Max 15 skills allowed"
    }
  }

}, {
  timestamps: true
}
);


//👉 When creating a schema method, ALWAYS use a normal function.
//❌ Never use arrow function.
// Adding a custom instance method to the user schema
// This method will be available on every user document

// 'this' refers to the current user object that called this method
// Example: the logged-in user's MongoDB record
//THIS can be used when instance of a model is created
//This can be used only when writing proper function and not arrow function

// Storing the current user document in a variable for easy access

// Creating a JWT token using the user's _id as payload
// This helps identify which user is making future requests

// Secret key is used to sign the token so it cannot be tampered with
// In real projects, this should be stored in .env, not hardcoded

// Setting token expiry to 7 days for security

// Returning the generated token to the controller or app.js
// So it can be sent to browser and stored in cookies

userSchema.methods.getJWT= async function (){
  const user=this;
  const token= await jwt.sign({_id:user._id},"Tinter@web$110",{expiresIn:"7d"});
 return token;
}


userSchema.methods.validatePassword= async function(passwordInputByUser){
  const user=this;
  const passwordHash= this.password;

  const isPasswordValid= await bcrypt.compare(passwordInputByUser,passwordHash);

  return isPasswordValid;
}


const User = mongoose.model("User", userSchema);

module.exports = User;
