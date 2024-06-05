import express from "express"
import authRouter from "./subroutes/authRoutes.js";
import listingRouter from "./subroutes/listingRouter.js";
import userRouter from "./subroutes/userRouter.js";
const router = express.Router();

// Auth Routes
router.use("/auth",authRouter);
// Listing Routes
router.use("/listing", listingRouter)
// User routes(things like profile updating)
router.use("/user",userRouter)

export default router;