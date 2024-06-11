import User from "../models/user.js";
import bcrypt from "bcrypt";


 const createProfile = async (req,res)=>{
    const profile = await User.create(req.body);
    res.status(200).send(profile)
}

export const updateProfile = async (req,res) =>{
    if(req.body.password){
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
       const  hashedPassword = await bcrypt.hash(req.body.password, salt);
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

        }
    }
}

export const getAnyUser = async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
       if(!user) res.status(204);
        res.status(200).send("User Found", others);
    } catch (e) {
        res.status(500).send(e)

    }
}

export const displayProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
      const {password,...others} = user._doc;
        if(!user) res.status(404).send("User not found");
        res.status(200).send("User Retrieved", others);
    }catch (e) {
        console.log(e);
        res.status(500).send(e)

    }
}

export const deleteUser = async (req,res) =>{
    try{
        if(req.user.id.toString() !== req.params.id ) res.status(403).send("Not allowed");

        const user = await User.findByIdAndDelete(req.user.id)
        res.status(200).send("User has been deleted")
    }catch (e){
        res.status(500).send(e)

    }
}

export const getUserStats = async (req,res)=>{
    try{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))

        const data = await User.aggregate([
            {$match: { createdAt:{ $gte: lastYear } } },
            {
                $project:{
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group:{
                    usersIn:"$month",
                    total: { $sum : 1 }
                }
            }
        ])
        res.status(200).send(data)
    }catch (e) {
        res.status(500).send(e)

    }
}