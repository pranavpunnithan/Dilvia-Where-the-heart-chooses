const mongoose= require("mongoose");

const connectionRequestSchema= new mongoose.Schema({

    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
      type:mongoose.Schema.Types.ObjectId, 
      required:true
    },
    status:{
        
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{timestamps:true}

);
// Compound index on fromUserId and toUserId to optimize lookup of connection requests between two users

connectionRequestSchema.index({fromUserId:1,toUserId:1}); 

//save is here like a function handler before calling save the pre will work(This is pre save middleware)
//Mongoose pre-save hook to validate that fromUserId and toUserId are not the same
// Prevents self-connection requests at the database level
connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
});




const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;

