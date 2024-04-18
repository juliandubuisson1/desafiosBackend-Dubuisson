import cartsModel from "../models/cartsModel.js"
import { isValidObjectId } from "../../utils.js"

export default class CartsManagerMongo {
    constructor() {
        this.carts = cartsModel
    }

    async getCarts() {
        try {
            return await this.carts.find()
        } 
        catch (error) {
            console.error(error)
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.carts.findById(id)
            if (!cart) throw new Error("Carrito no encontrado")
            return cart
        } 
        catch (error) {
            console.error("No se pudo encontrar el carrito",error)
        }
    }

    async createCart() {
        try {
            const newCart = await this.carts.create({})
            return newCart._id.toString()// Retorna el id del carrito creado convertido a string
        }
        catch (error) {
            console.error("No se pudo agregar el carrito", error)
        }
    }

    async addProductToCart(cid, pid) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
            
            //Buscar el carrito, si no existe, crearlo.
            // let cart = await this.carts.findById(cid)
            // if (!cart) {
            //     cart = await this.carts.create({ _id: cid, products: [] })
            // }

            // Buscar el carrito, si no lo encuentra lanza error.
            const cart = await this.carts.findById(cid)
            if (!cart) throw new Error("Carrito no encontrado")
            
            //Buscar el producto, si lo encuentra le suma uno a la cantidad. Si no lo encuentra le asigna quantity = 1
            const existingProductIndex = cart.products.findIndex(product => product._id.equals(pid))
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++
                return await cart.save()
            } else {
                cart.products.push({_id: pid, quantity: 1})
                return await cart.save()
            }
        } 
        catch (error) {
            console.error("No se pudo agregar el producto al carrito", error)
            throw error
        }
    }
    
    async deleteCartById(id) {
        try {
            if (!isValidObjectId(id)) throw new Error("El ID del carrito no es válido")
            const cart = await this.carts.findById(id)
            if (!cart) throw new Error("Carrito no encontrado")
            return await this.carts.findByIdAndDelete(id)
        }
        catch (error) {
            console.error("No se pudo eliminar el carrito", error)
            throw error
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
            //El método pull elimina un elemento del array que coincida con el valor especificado.
            return await this.carts.findByIdAndUpdate(cid, { $pull: {products: { _id: pid } }})
        }
        catch (error) {
            console.error("No se pudo eliminar el producto del carrito", error)
        }
    }
}
