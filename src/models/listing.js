import mongoose, {Schema} from "mongoose";
// import {enum} from "zod";
const listingSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required:true
    },
    img:{
        type: String,
        default:"",
        required:false
    },
    size: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isForSale: {
        type: Boolean,
        required: true
    },
    category:{
        type:String ,
        required:false
    }

});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
