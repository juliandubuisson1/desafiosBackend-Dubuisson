//const express = require('express');
import express from 'express'
const cartRouter = express.Router();
//const CartManager = required ('../managers/carts.manager.js');
import CartManager from '../managers/cart.manager.js'
const cartManager = new CartManager();

// GET /api/carts/:cid
cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error",  error: error.message});
    }
});

// POST /api/carts
cartRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error",  error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.addProductsToCart(cid, pid, quantity);
        res.status(201).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: "error",  error: error.message });
    }
});

//module.exports = cartRouter;
export default cartRouter