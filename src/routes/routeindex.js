import express from "express"
import authRouter from "./subroutes/authRoutes.js";
const router = express.Router();

router.use("/auth",authRouter);
export default router;