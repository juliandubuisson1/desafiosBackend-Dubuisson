const mongoose = require("mongoose");

const collectionName = "products";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required:true,
    },
    stock: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: [String],
        required: true,
    },
});

const productsModel = mongoose.model(collectionName, productsSchema);
module.exports =  productsModel;