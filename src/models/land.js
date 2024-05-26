import mongoose from "mongoose";
const landSchema = new mongoose.Schema({
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
        default:""
    },
    size: {
        type: String,
        required: true
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
    categories:{
        type: Array,
        required:false
    }

},{timestamps});

const Land = mongoose.model('Land', landSchema);

export default Land;
