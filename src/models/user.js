const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    minLength:4,
    maxLength:50,

  },
  lastName:{
    type:String
  },
  emailId:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    trim:true,
  },
  password:{
    type:String,
    required:true,
    select:false
  },
  age:{
    type:Number,
    min:18,
   max:45
  },
  gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    }

  },
  about:{
    type:String,
    default:"This is a default about of the user"
  },
  skills:{
    type:[String],
  }
},{
  timestamps:true,
})

const User= mongoose.model("User",userSchema);
//created a model by using the scheme and it is exporting to app.js to connect to app.js because that is where server is running

module.exports=User;