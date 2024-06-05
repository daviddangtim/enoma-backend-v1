import express from "express";
import protect from "../../middleware/routeProtection.js";
import {userOnly} from "../../middleware/roleBasedAccess.js";
import {updateProfile} from "../../controllers/userController.js";

const userRouter = express.Router();

userRouter.put("/signup", userOnly,updateProfile);
userRouter.delete("/delete",userOnly, deleteUser)
export default userRouter;