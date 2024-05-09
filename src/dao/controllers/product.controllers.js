import productService from "../../services/file_services/productManager.js"
import Cart from "../../models/mongo_models/cartsModel.js"

const productController = {
    getProducts: async (req, res) => {
        const { category, brand, sort } = req.query;
        let currentPage = req.query.page || 1;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const carts = await Cart.find({}).lean();

            const response = await productService.getProducts({ category, brand, sort }, currentPage);

            if (req.accepts('html')) {
                res.render('realTimeProducts', { response, Carts: carts, user, isAuthenticated, jwtToken });
            } else {
                res.json({ message: "Lista de productos:", response });
            }
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductDetail: async (req, res) => {
        const productId = req.params.pid;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const productDetail = await productService.getProductDetail(productId);

            if (req.accepts('html')) {
                return res.render('product', { Product: productDetail, user, isAuthenticated, jwtToken });
            }
        } catch (err) {
            console.error("Error al ver los detalles:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductCategory: async (req, res) => {
        const category = req.params.category;
        const { brand, sort } = req.query;
        let currentPage = req.query.page || 1;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const response = await productService.getProductCategory(category, { brand, sort }, currentPage);

            if (req.accepts('html')) {
                res.render('category', { response, user, isAuthenticated, jwtToken });
            } else {
                res.json({ message: "Lista de productos por categoria:", response });
            }
        } catch (err) {
            console.error("Error al ver la categoria:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addProduct: async (req, res) => {
        const productData = req.body;

        try {
            const newProduct = await productService.addProduct(productData, req);

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });
        } catch (err) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    updateProduct: async (req, res) => {
        const productId = req.params.pid;

        try {
            await productService.updateProduct(productId, req);

            return res.json({ message: "Producto actualizado!" });
        }
        catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.pid;
        const { userId } = req.body;

        try {
            await productService.deleteProduct(productId, userId);

            return res.json({ message: "Producto eliminado!" });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
}

export default productController;