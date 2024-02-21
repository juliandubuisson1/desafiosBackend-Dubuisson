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

//POST

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
    `title:         ${req.body.title},
    description:    ${req.body.description},
    code:           ${req.body.code},
    price:          ${req.body.price},
    stock:          ${req.body.stock},
    category:       ${req.body.category},
    thumbnail:      ${req.body.thumbnail},`
);
}catch (error){
        res.status(500).json("Error al agregar el producto");
}    
}); 


//PUT
productRouter.put("/update/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateFields = req.body;
    
        // Validar que se envíen campos a actualizar
        if (!Object.keys(updateFields).length) {
        return res.status(400).json({ error: 'No se enviaron campos a actualizar' });
        }
    
        // Leer archivo JSON de productos
        const rawData = fs.readFileSync('./products.json');
        let productos = JSON.parse(rawData);
    
        // Buscar el producto a actualizar
        const index = productos.findIndex(producto => producto.id === pid);
    
        // Si no se encuentra el producto, devolver error 404
        if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        // Crear copia del producto para actualizar
        const updatedProduct = { ...productos[index] };
    
        // Recorrer campos a actualizar
        for (const field in updateFields) {
          // Evitar actualizar el "id"
        if (field !== 'id') {
            updatedProduct[field] = updateFields[field];
        }
        }
    
        // Actualizar el array
        productos[index] = updatedProduct;
    
        // Guardar archivo JSON con productos actualizados
        fs.writeFileSync('./products.json', JSON.stringify(productos, null, 2));
    
        // Enviar respuesta exitosa
        res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json("Error al actualizar");
    }
    
});


//DELETE
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
        res.status(500).json("Error al eliminar el producto");
    }
});

export default productRouter;