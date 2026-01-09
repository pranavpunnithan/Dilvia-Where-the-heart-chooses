const mongoose = require('mongoose');
const validator = require("validator");

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
    unique: true,
    trim: true,       // Sanitizer: removes extra spaces

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

userSchema.methods.getJWT= async function (){
  const user=this;
  

}




const User = mongoose.model("User", userSchema);

module.exports = User;
