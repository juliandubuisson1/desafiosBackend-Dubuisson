const express = require('express');
const mongoose = require('mongoose');
const productFsRouter = require('./routes/file_routes/products.route.js')
const cartFsRouter = require ('./routes/file_routes/carts.route.js')
const productRoutes = require ('./routes/db_routes/products.route.js')
const cartRoutes = require ('./routes/db_routes/carts.route.js')
const multer = require('./utils');

//Funciones
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//FileSystem
app.use('/fs/products', productFsRouter);
app.use('/fs/carts', cartFsRouter);
//MongoDB
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


const PORT = 8080; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const connectMongoDB = async ()=>{
    const stringConnection = ("mongodb+srv://julianDubuisson:<password>@cluster0.gtbwigq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    try {
        await mongoose.connect(stringConnection);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();