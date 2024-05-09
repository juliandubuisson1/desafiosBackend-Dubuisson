import cartService from "../../services/file_services/cartManager.js";

const cartController = {
    getCartById: async (req, res) => {
        const cartId = req.params.cid;
        const { userId } = req.body;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const cart = await cartService.getCartById(cartId, userId);

            if (req.accepts("html")) {
                return res.render("cart", { cid: cart._id, cart: cart, user, isAuthenticated, jwtToken });
            }

            return res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito por ID:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    addProductToCart: async (req, res) => {
        const { productId, userId } = req.body;

        try {
            const cart = await cartService.addProductToCart(productId, userId);

            return res.json({ message: "Producto agregado al carrito correctamente", cartItemId: cart._id });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    updateCart: async (req, res) => {
        const cartId = req.params.cid;
        const { products, userId } = req.body;

        try {
            const cart = await cartService.updateCart(cartId, userId, products);

            return res.json(cart);
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    updateProductQuantityInCart: async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity, userId } = req.body;

        try {
            const cart = await cartService.updateProductQuantityInCart(cid, userId, pid, quantity);

            return res.json({ message: "Cantidad del producto en el carrito actualizada correctamente", cart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    deleteProductFromCart: async (req, res) => {
        const { cid, pid } = req.params;
        const { userId } = req.body;

        try {
            const cart = await cartService.deleteProductFromCart(cid, userId, pid);

            return res.json({ message: "Producto eliminado del carrito correctamente", cart });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    clearCart: async (req, res) => {
        const cartId = req.params.cid;
        const { userId } = req.body;

        try {
            const cart = await cartService.clearCart(cartId, userId);

            return res.json({ message: "Carrito vaciado completamente", cart });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    }
};

export default cartController;