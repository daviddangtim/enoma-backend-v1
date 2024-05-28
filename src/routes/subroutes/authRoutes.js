import express from "express";
import {login, signUp} from "../../controllers/auth/authController.js";
import protect from "../../middleware/routeProtection.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
// No login code yet
authRouter.post("/login",login);
export default authRouter;