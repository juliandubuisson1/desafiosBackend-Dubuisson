const mongoose = require("mongoose");

const collectionName = "carts";

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const cartsModel = mongoose.model(collectionName, cartsSchema);
module.exports =  cartsModel;