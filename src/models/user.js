import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
      type:String,
      required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"User"
    },
    isAdmin:{
        type:Boolean,
        required:false,
        default:false
    },
    profilePic:{
        type:String,
        default:"",
        required:false
    },
    cloudinary_id: {
        type: String,
        required: false
    }
});

const User = mongoose.model('User', userSchema);
export default User;