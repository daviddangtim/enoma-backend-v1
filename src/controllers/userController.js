import userAuth from "../middleware/authorization.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const updateProfile = async (req,res,next) =>{
    if(req.body.password){
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        let hashedPassword;
        hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    } else{
        try{
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                {
                $set: req.body
            },{new:true} );
            res.status(200).send("User Updated", updatedUser)
        }catch (e){
            res.status(500).send(e)
            throw new Error
        }
    }
}

export const getUser = async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
       if(!user) res.status(204);
        res.status(200).send("User Found", user);
    } catch (e) {
        res.status(500).send(e)
        throw new Error
    }

}