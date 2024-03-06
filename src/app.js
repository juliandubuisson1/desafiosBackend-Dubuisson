/* import express from "express";
const app = express();
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars"
import ensureFileExists from "./utils.js";

const port = 8080

app.use(express.urlencoded({extended : true }));
app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(port, ()=>{
    console.log(`Server corriendo en puerto ${port}`);
}) */

const express = require('express');
const { Server } = require('socket.io');
const handlebars = require("express-handlebars");
const ProductManager = require("./managers/products.js");


const app = express();
const newDirname = 'Desafios/src'

const productsManager = new ProductManager();
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
server.on("error", error => console.log(`Server error: ${error}`));

const socketServer = new Server(server);

app.get("/", async (req, res) => {
    const id = req.params.id;
    const limit = req.query.limit;
    try {
        if (!!id) {
            res.send(await productsManager.getProductById(id));
        } else {
            return res.render("home", { products: await productsManager.getAllProducts(limit) });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: -1, description: "Error fetching products" });
    }
});

app.get("/realtimeproducts", async (req, res) => {
    return res.render("realtimeproducts");
});

socketServer.on('connection', (socket) => {
    console.log('User connected');

socket.on('new-product', async (product) => {
    console.log('New product:', product);
    await productsManager.saveProduct(product);
    socket.emit('new-product-list', await productsManager.getAllProducts());
});

socket.on('delete-product', (productId) => {
    console.log('Delete product:', productId);
});

socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.engine("handlebars", handlebars.engine());
app.set("views", newDirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static('public'));

// app.use('/static', express.static(__dirname + '/public'));
app.use(express.json());