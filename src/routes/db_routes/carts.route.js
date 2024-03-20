const express = require('express');
const router = express.Router();
const CartsService = require('../../services/db_services/carts.service');
const cartsService = new CartsService();

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartsService.getCartById(cid);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error",  error: error.message});
    }
});

// POST /api/carts
router.post("/", async (req, res) => {
    try {
        const newCart = await cartsService.createCart();
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
    const updatedCart = await cartsService.addProductsToCart(cid, pid, quantity);
        res.status(201).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: "error",  error: error.message });
    }
});

module.exports = router;