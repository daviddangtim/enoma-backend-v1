import Payment from "../../models/payment.js";
import Stripe from "stripe";

export const createPayment = async (req, res) => {
    const payment = new Payment(req.body);
    try {
        const savedPayment = await payment.save();
        res.status(200).json(savedPayment);
    } catch (error) {
        res.status(500).json(error);
    }
}

