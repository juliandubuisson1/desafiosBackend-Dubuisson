import Cart from "../models/mongo_models/cartsModel.js";
import Product from "../models/mongo_models/productsModel.js";
import User from "../models/mongo_models/Users.model.js";

const cartController = {
  getCartById: async (req, res) => {
    const cartId = req.params.cid;
    const user = req.session.user;
    const isAuthenticated = req.session.isAuthenticated;

    try {
      // Intentar encontrar el carrito en la base de datos por su ID
      const cart = await Cart.findById(cartId).populate({
        path: 'products',
        model: 'Product'
      }).lean();

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      if (req.accepts("html")) {
        // Renderizar el archivo Handlebars
        return res.render("cart", { cid: cart._id, cart: cart, user, isAuthenticated });
      }

      return res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId;

    try {
      // Buscar el producto en la base de datos
      const product = await Product.findById(productId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ error: "No esta autorizado" })
      }

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Verificar si hay suficiente stock
      if (product.stock < 1) {
        return res.status(400).json({ error: "Producto fuera de stock" });
      }

      // Verificar si ya existe un carrito para el usuario
      let cart = await Cart.findOne({});

      // Si no hay un carrito existente, crear uno nuevo
      if (!cart) {
        cart = new Cart({
          items: [],
        });
      }

      // Crear un nuevo elemento de carrito
      const cartItem = new Cart({
        products: [{
          product: productId,
          productQuantity: 1,
          productPrice: product.price,
          productTotal: product.price * 1,
        }],
        total: product.price,
        user: userId,
      });

      // Guardar el nuevo elemento de carrito en la base de datos
      const savedCartItem = await cartItem.save();

      return res.json({ message: "Producto agregado al carrito correctamente", cartItemId: savedCartItem._id });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },

  updateCart: async (req, res) => {
    const cartId = req.params.cid;
    const { userId } = req.body;

    try {
      const cart = await Cart.findById(cartId).populate({
        path: 'products.product',
        model: 'Product',
      });

      // Verificar si el carrito existe
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
      if (cart.user.toString() !== userId) {
        return res.status(403).json({ error: "No tienes permiso para actualizar este carrito" });
      }

      // Obtener los nuevos productos que se van a agregar al carrito desde el cuerpo de la solicitud
      const newProducts = req.body.products;

      // Iterar sobre los nuevos productos y actualizar el carrito
      for (const newProduct of newProducts) {
        const existingProductIndex = cart.products.findIndex(product => product.product._id.toString() === newProduct.productId);

        if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, aumentar la cantidad y el subtotal
          cart.products[existingProductIndex].productQuantity += newProduct.productQuantity;
          cart.products[existingProductIndex].productTotal += (newProduct.productQuantity * cart.products[existingProductIndex].productPrice);
        } else {
          // Si el producto no está en el carrito, agregarlo al arreglo de productos del carrito
          const product = await Product.findById(newProduct.productId);
          if (!product) {
            console.log(`Producto con ID ${newProduct.productId} no encontrado`);
            continue;
          }
          cart.products.push({
            product: product,
            productQuantity: newProduct.productQuantity,
            productPrice: product.price,
            productTotal: newProduct.productQuantity * product.price,
          });
        }
      }

      // Calcular el nuevo total del carrito sumando los subtotales de todos los productos
      cart.total = cart.products.reduce((total, product) => total + product.productTotal, 0);

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      return res.json(cart);
    }
    catch (error) {
      console.log("Error al intentar actualizar el carrito:", error);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
  },

  updateProductQuantityInCart: async (req, res) => {
    const { pid } = req.params;
    const cartId = req.params.cid;
    const { quantity, userId } = req.body;

    try {
      const cart = await Cart.findById(cartId).populate({
        path: 'products',
        model: 'Product'
      });

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
      if (cart.user.toString() !== userId) {
        return res.status(403).json({ error: "No tienes permiso para actualizar este carrito" });
      }

      // Buscar el índice del producto en la matriz de productos del carrito
      const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

      if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }

      // Obtener el producto del carrito
      const productInCart = cart.products[productIndex];

      // Obtener el producto desde la base de datos para obtener su precio
      const product = await Product.findById(productInCart.product);

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado en la base de datos" });
      }

      // Actualizar la cantidad del producto en el carrito
      productInCart.productQuantity += parseInt(quantity);

      // Actualizar el total en función del precio del producto y la nueva cantidad
      productInCart.productTotal += product.price * parseInt(quantity);

      // Recalcular el total del carrito sumando los precios de todos los productos
      cart.total = cart.products.reduce((total, item) => total + item.productTotal, 0);

      // Guardar los cambios en la base de datos
      await cart.save();

      return res.json({ message: "Cantidad del producto en el carrito actualizada correctamente", cart });
    } catch (error) {
      console.log("Error al intentar actualizar la cantidad del producto en el carrito:", error);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
  },

  deleteProductFromCart: async (req, res) => {
    const pid = req.params.pid;
    const cartId = req.params.cid;
    const { userId } = req.body;

    try {
      const cart = await Cart.findById(cartId).populate({
        path: 'products.product',
        model: 'Product',
      });

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
      if (cart.user.toString() !== userId) {
        return res.status(403).json({ error: "No tienes permiso para borrar este producto del carrito" });
      }

      const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid);

      if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      const productToRemove = cart.products[productIndex];
      const productPrice = productToRemove.product.price;
      const productQuantity = productToRemove.productQuantity;

      // Restar la cantidad y el total del producto eliminado
      cart.quantity -= productQuantity;
      cart.total -= productPrice * productQuantity;

      // Eliminar el producto del array
      cart.products.splice(productIndex, 1);

      // Si el carrito queda vacío, establecer el total en 0
      if (cart.products.length === 0) {
        cart.total = 0;
      }

      await cart.save();

      return res.json({ message: "Producto eliminado del carrito correctamente", cart });
    } catch (error) {
      console.log("Error al eliminar el producto:", error);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
  },

  clearCart: async (req, res) => {
    const cartId = req.params.cid;
    const { userId } = req.body;

    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
      if (cart.user.toString() !== userId) {
        return res.status(403).json({ error: "No tienes permiso para borrar el carrito" });
      }

      // Vaciar la lista de productos del carrito
      cart.products = [];

      // Restablecer quantity y total a cero
      cart.total = 0;
      await cart.save();

      return res.json({ message: "Carrito vaciado completamente", cart });
    }
    catch (error) {
      console.log("Error al intentar vaciar el carrito:", error);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
  }
};

export default cartController;