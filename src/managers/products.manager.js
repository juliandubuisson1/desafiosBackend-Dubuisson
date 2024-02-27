//const fs = require("fs");
import fs from 'fs'
//const { v4: uuidv4 } = require('uuid');
import {v4 as uuidv4} from 'uuid'
//const { ensureFileExists } = require('../utils');
import ensureFileExists from '../utils.js';

class ProductsManager {

    constructor(id, name, timestamp, description, code, imageUrl, price, stock) {
        this.id = id;
        this.timestamp = timestamp;
        this.name = name;
        this.description = description;
        this.code = code;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stock = stock;
        this.productsFilePath = './src/data/products.json';
    }
    
    async getAllProducts(limit = null) {
        console.log("ProductsFilePath", this.productsFilePath);
        try {
            await ensureFileExists(this.productsFilePath); // aseguro que el archivo exista

            const data = await fs.promises.readFile(this.productsFilePath, "utf-8");
            if (data.trim() === "") {
                console.error("No hay productos cargados");
                throw new Error("No hay productos cargados");
            }

            const products = JSON.parse(data);

            if (limit && !isNaN(limit)) {
                products = products.slice(0, parseInt(limit));
            }
            return products;

        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener todos los productos");
        }
    }

    async getProductById(pid) {        
        try {
            await ensureFileExists(this.productsFilePath); 

            const data = await fs.promises.readFile(this.productsFilePath, "utf-8");
            if (data.trim() === "") {
                console.error("No hay productos cargados");
                throw new Error("No hay productos cargados");
            }

            const products = JSON.parse(data);
            const product = products.find((product) => product.id == pid);
            if (!product) {
                console.error("Producto no encontrado");
                throw new Error("Producto no encontrado");
            }
            console.log("GetProductById", product);
            return product;          
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener el producto por ID");
        }
    }

    async addProduct(newProduct) {
        try {
            await ensureFileExists(this.productsFilePath); 
            const requiredParams = ["title", "description", "code", "price", "stock"];
            const missingParams = requiredParams.filter(param => !(param in newProduct));
            if (missingParams.length > 0) {
                console.log("Faltan parámetros obligatorios", missingParams);
            }

            const data = await fs.promises.readFile(this.productsFilePath, "utf-8");

            const productsList = JSON.parse(data);
            if (productsList.some((product) => product.code === newProduct.code)) {
                throw new Error(`Ya existe un producto con el código ${newProduct.code}`);
            }

            newProduct.id = uuidv4();
            productsList.push(newProduct);
            console.log("Parsed Data", productsList);
            await fs.promises.writeFile(this.productsFilePath, JSON.stringify(productsList, null,"\t"));
            console.log("producto agregado", productsList);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Error al guardar el producto");
        }
    }

    async updateProductById(pid, updatedProductData) {
        try {
            await ensureFileExists(this.productsFilePath);
            let products = await this.getAllProducts();
            const index = products.findIndex((product) => product.id == pid);

            if (index === -1) {
                console.error(`No se encontró ningún producto con el ID ${pid}`);
                throw new Error(`No se encontró ningún producto con el ID ${pid}`);
            }

            // Se actualiza los campos del producto con los datos enviados
            // desde el cuerpo de la solicitud, sin modificar el ID.
            const id=pid;
            products[index] = { ...products[index], ...updatedProductData, id };
            await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, "\t"));
            return products[index];
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProductById(pid) {
        try {
            await ensureFileExists(this.productsFilePath);
            let products = await this.getAllProducts();
            const index = products.findIndex((product) => product.id == pid);

            if (index === -1) {
                console.error(`No se encontró ningún producto con el ID ${pid}`);
                throw new Error(`No se encontró ningún producto con el ID ${pid}`);
            }

            products.splice(index, 1);
            await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, "\t"));
            return 1;
            
        } catch (error) {
            console.log(`Error al borrar el producto con ID ${pid}: ${error}`);
            throw new Error("Error al borrar el producto");
        }
    }
}

//module.exports = ProductsManager;
export default ProductsManager

