import mongoose from "mongoose";

const generateTrackingId = () => {
    const number = 100000
    return Math.floor(1000 * Math.random() * number).toString().slice(0, 5);
}

var productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        // required: true
    },
    oldprice: {
        type: Number,
        // required: true
    },
    deal: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: [],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
    },
    trackingId : {
        type: String,
        unique: true,
        default : generateTrackingId
    },
    size: {
        type:[],
        // required: true
    },
    gender: {
        type:String,
        required: true
    },

}, {timestamps: true});

const Products = mongoose.model('product', productsSchema);

export default Products;