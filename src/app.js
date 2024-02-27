/* import express from 'express';
import bodyParser from 'body-parser';
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js"


const app = express();
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter)


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
}); */

import express from "express";
const app = express();
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import ensureFileExists from "./utils.js";
/* const productRouter = required ('./routes/product.router');
const cartRouter = required ('./routes/cart.router');
const multer = required ('./utils'); */


const port = 8080

app.use(express.urlencoded({extended : true }));
app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(port, ()=>{
    console.log(`Server corriendo en puerto ${port}`);
})