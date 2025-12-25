const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  emailId:{
    type:String
  },
  password:{
    type:String
  },
  age:{
    type:Number
  },
  gender:{
    type:String

  }
})

const User= mongoose.model("User",userSchema);
//created a model by using the scheme and it is exporting to app.js to connect to app.js because that is where server is running

module.exports=User;