import Payment from "../../models/payment.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import * as stripe from "stripe";
dotenv.config();

export const createNewPayment = (req,res) => {

    const payment = new Payment({
        name: req.body.name,
        amount: req.body.amount
    })
}




