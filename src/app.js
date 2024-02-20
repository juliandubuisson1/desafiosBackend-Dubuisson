/* import express from "express";
import http from "http";

import cartRouter from "./routes/cart.router.js";

const app = express();
const server = http.createServer(app);

app.use(express.json())

app.use("/api/carts", cartRouter);

server.listen(8080,() => {
    console.log("Servidor corriendo en puerto 8080");
}) */

import express from 'express';
import bodyParser from 'body-parser';
import productRouter from "./routes/product.router.js";
// 👇️ if you use CommonJS require()
// const express = require('express');
// const bodyParser = require('body-parser');

const app = express();
app.use("/api/products", productRouter);
// ✅ Register the bodyParser middleware here
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

/* productRouter.post('/add', function (req, res) {
  // ✅ req.body is an object here
    console.log('req.body: ', req.body);

    console.log(`
        title:          ${req.body.title},
        description:    ${req.body.description},
        code:           ${req.body.code},
        price:          ${req.body.price},
        stock:          ${req.body.stock},
        category:       ${req.body.category},
        thumbnail:      ${req.body.thumbnail},`
    );

    res.send(
        `title:          ${req.body.title},
        description:    ${req.body.description},
        code:           ${req.body.code},
        price:          ${req.body.price},
        stock:          ${req.body.stock},
        category:       ${req.body.category},
        thumbnail:      ${req.body.thumbnail},`
    );
}); */

const port = 8080;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});