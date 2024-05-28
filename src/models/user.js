import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
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
    }
});

const User = mongoose.model('User', userSchema);
export default User;