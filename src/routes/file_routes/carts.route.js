const express = require('express');
const router = express.Router();
const CartManager = require('../../services/file_services/carts.manager');
const cartManager = new CartManager();

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
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
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error",  error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.addProductsToCart(cid, pid, quantity);
        res.status(201).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: "error",  error: error.message });
    }
});

module.exports = router;