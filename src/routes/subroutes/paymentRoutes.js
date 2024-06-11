import express from "express"
const payRouter = express.Router();
import {createPaymentIntent} from "../../controllers/payment/paymentController.js";
import {userOnly} from "../../middleware/roleBasedAccess.js";


payRouter.post("/pay",userOnly,createPaymentIntent);

export default payRouter;