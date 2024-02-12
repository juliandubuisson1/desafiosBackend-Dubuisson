import {promises as fs} from 'fs'
const PATH = './productos.json'


class ProductManager {

    constructor (){
        this.PATH = []
    }

    static id = 0

    addProduct = async (title, description, price, thumbnail, code, stock) =>{
        

        for(let i = 0; i < this.PATH.length; i++){
            if (this.PATH [i].code === code){
                console.log(`El codigo ${code}, esta repetido`);
                break
            }
        }

        ProductManager.id++
        const newProduct = {
            title,
            description,
            price,
            thumbnail, 
            code,
            stock,
            id: ProductManager.id
        }

        this.PATH.push(newProduct)

        await fs.writeFile (PATH, JSON.stringify(this.PATH), 'utf-8') 

        if(!Object.values (newProduct).includes(undefined)){
            ProductManager.id++;
            this.PATH.push({
                ...newProduct,
                id:ProductManager.id 
            });
        } else {
            console.log("Todos los campos son requeridos");
        }        
        
    };


    readProducts = async () => {
        let result = await fs.readFile(PATH, 'utf-8')
        return JSON.parse(result)
        
    }
    
    
    getProdcuts = async () => {
        let resultGetProducts = await this.readProducts()
        return console.log(resultGetProducts);
    }

    getProductsById = async (id) => {

        let resultProductById = await this.readProducts()
        if (!resultProductById.find (producto => producto.id === id)){
            console.log("ID no encontrado");
        }else {
            
            console.log(resultProductById.find(producto => producto.id === id));
        }
    }

    deleteProduct = async (id) => {
        let resultProductById = await this.readProducts();
        let productFilter = resultProductById.filter((products => products.id != id));
        await fs.writeFile(PATH, JSON.stringify(productFilter), 'utf-8')
        console.log("El producto fue eliminado");
    }

    updateProduct = async (id, ...producto) => {
        await this.deleteProduct(id);
        let productUpdate = await this.readProducts();
        let productoMod = [{...producto, id,}, ...productUpdate]
        await fs.writeFile(PATH, JSON.stringify(productoMod))
    };
}

const productos = new ProductManager()

//LLAMADA AL ARRAY VACIO

console.log(productos.getProdcuts());

//AGREGAR PRODUCTOS 

productos.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)

//GETPRODUCTS

console.log(productos.getProdcuts());

//BUSQUEDA DE ID NO ENCONTRADO

productos.getProductsById(8);

//BUSQUEDA DE ID

productos.getProductsById(1)

//ACTUALIAR PRODUCTO

productos.updateProduct({
    title: 'producto prueba',
    description:'Este es un producto prueba',
    price: 300,
    thumbnail:'Sin imagen', 
    code:'abc123',
    stock: 25,
    id:2
})


//ELIMINAR PRODUCTO

productos.deleteProduct()

export default ProductManager;