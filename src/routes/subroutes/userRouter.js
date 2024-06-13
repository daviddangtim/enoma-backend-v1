import express from "express";
import protect from "../../middleware/routeProtection.js";
import {userOnly} from "../../middleware/roleBasedAccess.js";
import {updateProfile, deleteUser,  displayProfile} from "../../controllers/userController.js";
import upload from "../../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/profile",userOnly, displayProfile);
userRouter.put("/profile",upload.single('image'), userOnly,updateProfile);
userRouter.delete("/profile",userOnly, deleteUser)
export default userRouter;