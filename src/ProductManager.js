import {promises as fs} from 'fs'
import { randomUUID } from 'node:crypto'

export class ProductManager{

    constructor(){
        this.path = 'products.json';
        this.products = []
    }

    addProduct = async ({title,description,code,price,status,stock,category,thumbnails}) =>{
        console.log(addProduct);

        const id = randomUUID()

        let newProduct = {id, title,description,code,price,status,stock,category,thumbnails}

        this.products.push(newProduct)

        await fs.writeFile(this.path, JSON.stringify(this.products))

        return newProduct
    }

    getProducts = async () => {
        const response = await fs.readFile(this.path, 'utf-8')
        const responseJSON = JSON.parse(response)

        return responseJSON
    }

    getProductsById = async (id) =>{
        const response = this.getProducts()

        const product = response.find(product => product.id === id)

        if(product) {
            return product
        }else {
            console.log('Producto no encontrado');
        }
    }

    updateProduct = async (id, {...data}) => {
        const response = this.getProducts()
        const index = response.findeIndex(product => product.id === id)

        if(index != -1 ){
            response[index] = {id, ...data}
            await fs.writeFile(this.path, JSON.stringify(response))
            return response [index]
        }else{
            console.log('Producto no encontrado');
        }
    }

    deleteProduct = async (id) => {
        const products = this.getProducts()
        const index = products.findeIndex(product => product.id === id)

        if(index != -1){
            products.splice(idnex, 1)
            await fs.writeFile(this.path, JSON.stringify(product))
        }else{
            console.log('Producto no encontrado');
        }
    }
}