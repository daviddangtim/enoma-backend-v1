import User from "../../models/user.js";
import bcrypt from 'bcrypt';

// Signup
export const signUp = async (res,req,next) => {
    try {
        const {firstName, lastName, email, password, contactNumber, role, isAdmin} = req.body;
        // Hashing the password
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);
        //Creating a user document
        // Will add validation soon
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            role,
            isAdmin
        });
        // If server receives the data
        if (usercreated) {
            const usercreated = await newUser.save();
            res.status(201).json({message: "User Created Successfully!", user: usercreated})
        }else {
            res.status(400).json({ BadRequest : "Please enter your details"})
            console.error()
        }
    } catch (e) {
        res.staus(500).json({message: "Server encountered an error", error: e})
        console.log(`Server encountered an error ${e}`)
    }
}

export const login = (res,req,next) => {
        const {email, password} = req.body;
        const loginUser = User.findById({email})
}