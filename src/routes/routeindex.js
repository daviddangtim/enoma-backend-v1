import express from "express"
import authRouter from "./subroutes/authRoutes.js";
import listingRouter from "./subroutes/listingRouter.js";
const router = express.Router();

router.use("/auth",authRouter);
router.use("/listing", listingRouter)
export default router;