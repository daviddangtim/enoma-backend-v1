import express from "express"
const payRouter = express.Router();
import {createNewPayment} from "../../controllers/payment/paymentController.js";
import {userOnly} from "../../middleware/roleBasedAccess.js";


payRouter.post("/pay",userOnly,createNewPayment);

export default payRouter;