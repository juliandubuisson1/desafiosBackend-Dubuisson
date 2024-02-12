import express from 'express' 
import fs from 'fs'

//CONSTANTES
const port = 8080
const app = express()
const proudctsData = fs.readFileSync('./products.json', 'utf-8')
const products = JSON.parse (proudctsData)



app.get("/products", (req, res) => {
    const { limit } = req.query;
    let data = products;

    if (limit) {
        data = data.slice(0, parseInt(limit));
    }

    res.send(data);
});


app.get("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    const product = products.find((producto) => producto.id == productId);

    if (!product) {
        return res.send("Producto no encontrado");
    }

    res.send(product);
});


app.listen(port, () => console.log("Servidor corriendo en", port))