import mongoose, {Schema} from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems:[{
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },],

})

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;