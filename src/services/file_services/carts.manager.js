const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { ensureFileExists } = require('../../utils');

class CartManager {

    constructor(id, products) {
        this.id = id;
        this.products = products;
        this.cartsFilePath = 'src/data/carts.json';
    }

    async getCartById(cid) {
        try {
            await ensureFileExists(this.cartsFilePath); // aseguro que el archivo exista

            const data = await fs.promises.readFile( this.cartsFilePath, "utf-8");

            if (data.trim() === "") {
                console.error("No hay Carritos cargados");
                throw new Error("No hay Carritos cargados");
            }

            const carts = JSON.parse(data);
            console.log("getCartById", carts);
            const cart = carts.find((cart) => cart.id === cid.toString());

            if (!cart) {
                console.log("Carrito no encontrado");
                throw new Error("Carrito no encontrado");
            }
            console.log("getProductsByCartId", cart);
            return cart;
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener el carrito por ID");
        }
    }

    async createCart() {
        try {
            let carts = [];
            await ensureFileExists(this.cartsFilePath);

            const cartId = uuidv4();
            const newCart = {
                id: cartId,
                products: []
            };
            carts.push(newCart);
            await fs.promises.writeFile( this.cartsFilePath, JSON.stringify(carts, null, "\t"));
            console.log("Nuevo carrito creado:", newCart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    async addProductsToCart(cid, pid, quantity) {

    try {
        await ensureFileExists(this.cartsFilePath);

        const data = await fs.promises.readFile( this.cartsFilePath, "utf-8");

        if (data.trim() === "") {
            console.error("No hay Carritos cargados");
            throw new Error("No hay Carritos cargados");
        }

        const cartList = JSON.parse(data);
        const cartIndex = cartList.findIndex((cart) => cart.id === cid);
        console.log("updateCartProductsById", cartList);

        if (cartIndex === -1) {
            throw new Error(`No se encontró ningún carrito con el ID ${cid}`);
        }

        const productIndex = cartList[cartIndex].products.findIndex(
        (product) => product.product === pid
        );
        console.log("updateCartProductsById", productIndex);
        if(quantity < 1) {
            throw new Error(`La cantidad debe ser mayor a 0`);
        }

        if (productIndex == -1) {
            cartList[cartIndex].products.push({ product: pid, quantity });
        } else {
            cartList[cartIndex].products[productIndex].quantity += quantity;
        }

        await fs.promises.writeFile(this.cartsFilePath, JSON.stringify(cartList, null, "\t")
        );

        return cartList[cartIndex];
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
}
module.exports = CartManager;