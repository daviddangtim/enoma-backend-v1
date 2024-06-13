import User from "../models/user.js";
import bcrypt from "bcrypt";



export const updateUserDetails = async (req, res, next) => {
    try {
        const userToUpdate = await User.findById(req.user.id);
        if (!userToUpdate) {
            return res.status(404).json({ Message: "User not found" });
        }

        // If a new image file is provided
        if (req.file && userToUpdate.cloudinary_id) {
            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(userToUpdate.cloudinary_id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error deleting old image"
                    });
                }
            });

            // Upload the new image to Cloudinary
            const image = await cloudinary.uploader.upload(req.file.path);
            req.body.profilePic = image.secure_url; // Update the profile image URL in req.body
            req.body.cloudinary_id = image.public_id; // Update the Cloudinary ID in req.body
        }

        // Update the user's details
        const updatedUser = await User.updateOne({ _id: req.user.id }, req.body);

        if (updatedUser.nModified > 0) {
            res.status(200).json({ Message: "User updated successfully" });
        } else {
            res.status(400).json({ Message: "User update failed" });
        }
    } catch (e) {
        res.status(500).json({ Message: "Internal Server Error" });
        console.error(e.message);
        console.log(`An error was encountered in updateUserDetails: ${e}`);
    }
};


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

export const sortedByRole = async (req,res) =>{
    try {
        const user = await User.find({role: req.params.role});

        if(!user) res.status(404).send("User not found");

         res.status(200).json({Message:"Users sorted by role", user});

        res.status(200).send("User Retrieved", user);
    } catch (e) {
        res.status(500).json({Message:"Internal Server Error", Error: e.message});
        console.log(e)
    }
}