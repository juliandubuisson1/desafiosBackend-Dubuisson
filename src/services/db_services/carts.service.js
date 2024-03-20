const cartsModels = require('../../models/mongo_models/carts.schema');

class CartsService {
    constructor() {
        this.cartsModel = cartsModels;
    }

    async getCartById(cartId) {
        return await this.cartsModel.findById(cartId);
    }

    async createCart() {
        return await this.cartsModel.create({});
    }

    async addProductsToCart(cartId, productId, quantity) {
        const cart = await this.cartsModel.findById(cartId);
        const product = cart.products.find((product) => product.product.toString() === productId);

        if (product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }
}

module.exports = CartsService;