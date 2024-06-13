import express from "express";
import protect from "../../middleware/routeProtection.js";
import {userOnly} from "../../middleware/roleBasedAccess.js";
import {deleteUser, displayProfile, sortedByRole, updateUserDetails} from "../../controllers/userController.js";
import upload from "../../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/profile",userOnly, displayProfile);
userRouter.get("/users/:role",userOnly, sortedByRole);
userRouter.put("/profile",upload.single('image'), userOnly,updateUserDetails);
userRouter.delete("/profile",userOnly, deleteUser)
export default userRouter;