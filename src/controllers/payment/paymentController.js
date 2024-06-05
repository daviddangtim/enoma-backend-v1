import Payment from "../../models/payment.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import * as stripe from "stripe";
dotenc.config();

export const createPayment = async (req, res) => {
    const payment = new Payment(req.body);
    try {

       if(stripe.charges.create({
           source:req.body.tokenId,
           amount: req.body.amount,
           currency: req.body.currency
       },(stripeErr, stripeRes)=>{
           if(stripeErr){
               res.status(500).send(stripeErr)
           } else{
               res.status(200).send(stripeRes)
           }

       })){
           await payment.save()
       }
    } catch (error) {
        res.status(500).json(error);
    }
}
export const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        // Store the PaymentIntent ID and other details in your database here
        // Example:
        // savePaymentIntentToDB(paymentIntent.id, amount, 'pending');

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const handleWebhook = (req, res) => {
    const endpointSecret = 'your_webhook_secret';
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Update payment status in your database
            // Example:
            // updatePaymentIntentStatus(paymentIntent.id, 'succeeded');
            break;
        // Handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};


