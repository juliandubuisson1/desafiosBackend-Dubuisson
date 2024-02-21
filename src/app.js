import express from 'express';
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
});