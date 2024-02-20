import express from "express";
import fs from "fs";

const productRouter = express.Router();

productRouter.use(express.json());

productRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const rawData = fs.readFileSync("./products.json");
        const productos = JSON.parse(rawData);
        
        let result = productos;
        if (limit) {
            result = productos.slice(0, limit);
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const rawData = fs.readFileSync("./products.json");
        const productos = JSON.parse(rawData);
        
        const product = productos.find(producto => producto.id === pid);
        
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.post("/add", async (req, res) =>{
try{
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
const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail
    } = req.body;
    //fs.readdir("./", (err, files) => { 
    //    if (err) 
    //        console.log(err); 
    //    else { 
    //        console.log("\nCurrent directory filenames:"); 
    //    files.forEach(file => { 
    //        console.log(file); 
    //    }) 
    //    } 
    //}) 
const rawData = fs.readFileSync("./products.json");
const productos = JSON.parse(rawData);

const newProduct = {
    id: productos.length + 1,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnail
};
productos.push(newProduct);

    // Guarda los productos en el archivo JSON
    fs.writeFileSync("./products.json", JSON.stringify(productos, null, 2));


res.send(
    `title:          ${req.body.title},
    description:    ${req.body.description},
    code:           ${req.body.code},
    price:          ${req.body.price},
    stock:          ${req.body.stock},
    category:       ${req.body.category},
    thumbnail:      ${req.body.thumbnail},`
);
}catch (error){
        res.status(500).json({ error: "Internal Server Error" });
}    
}); 

productRouter.put("/update/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateFields = req.body;
        
        if (!Object.keys(updateFields).length) {
            return res.status(400).json({ error: "No fields to update provided" });
        }

        const rawData = fs.readFileSync("./products.json");
        let productos = JSON.parse(rawData);

        const index = productos.findIndex(producto => producto.id === pid);
        
        if (index === -1) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Copia el producto encontrado para actualizarlo
        const updatedProduct = { ...productos[index] };

        // Actualiza los campos proporcionados en el cuerpo de la solicitud
        for (const field in updateFields) {
            if (field !== "id") { // Evita actualizar el campo "id"
                updatedProduct[field] = updateFields[field];
            }
        }

        // Actualiza el producto en el array de productos
        productos[index] = updatedProduct;

        // Guarda el array actualizado de productos en el archivo JSON
        fs.writeFileSync("./products.json", JSON.stringify(productos, null, 2));

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.delete("/delete/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);

        const rawData = fs.readFileSync("./products.json");
        let productos = JSON.parse(rawData);

        const index = productos.findIndex(producto => producto.id === pid);
        
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Elimina el producto del array de productos
        productos.splice(index, 1);

        // Guarda el array actualizado de productos en el archivo JSON
        fs.writeFileSync("./products.json", JSON.stringify(productos, null, 2));

        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default productRouter;