const socket = io()
const productList = document.getElementById("productList")
const productForm = document.getElementById("productForm")

document.addEventListener("DOMContentLoaded", () => {
    socket.emit("initialProducts")
})

// Escuchar el evento "productList" del servidor
socket.on("productList", (products) => {
    console.log("Lista de productos: ", products)
    renderProducts(products)
})


// Manejar el envío del formulario
productForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(productForm)
    const product = {}
    
    for (const [key, value] of formData.entries()) {
        // Si el key es "status" cambia el valor a true o false, sino asigna el valor del input al objeto product
        product[key] = key === 'status' 
        ? formData.get(key) === 'on' 
        : value;
        // Si el key es "price" o "stock", convierte el valor a un número
        product[key] = key === 'price' || key === 'stock' 
        ? parseFloat(value) 
        : value;
    }
    
    // Emitir el nuevo producto al servidor para almacenarlo en products.json
    socket.emit("newProduct", product)
    console.log("Cliente/evento newProduct", product)
})


// Función para renderizar la lista de productos en la página
const renderProducts = (productsArray) => {
    productList.innerHTML = ""
    productsArray.forEach((product) => {
        const productElement = document.createElement("div")
        productElement.classList.add('card', 'm-3', 'border-secondary')
        productElement.innerHTML = `
            <img src="${product.thumbnail}" class="img-fluid rounded-start img-thumbnail" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Descripción: ${product.description}</p>
                <p class="card-text">Precio: $${product.price}</p>
                <p class="card-text">Código: ${product.code}</p>
                <p class="card-text">Stock: ${product.stock}</p>
            </div>
        `
        productList.appendChild(productElement)
    })
}

// Manejar el envío del formulario de eliminación
const deleteProductForm = document.getElementById("deleteProductForm")
deleteProductForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(deleteProductForm)
    const productId = parseInt(formData.get("productId"))
    
    socket.emit("deleteProduct", productId)
    console.log("Cliente/evento deleteProduct", productId)
})