import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Land',
        required: true
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    address:{
        type:Object,
        required:true
    }

});

const Order = mongoose.model('Order', orderSchema);

export default Order;
