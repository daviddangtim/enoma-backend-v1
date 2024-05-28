import express from "express"
import authRouter from "./authRoutes.js";
const router = express.Router();
import protect from "../../middleware/routeProtection.js";


router.use("/",authRouter);
export default router;