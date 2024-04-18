import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    postal_code: Number,
    phone: Number,
    card_Bank: Number,
    security_Number: Number,
    date: {
        type: Date,
        default: Date.now,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            productQuantity: Number,
            productPrice: Number,
            productTotal: Number,
        }
    ],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;