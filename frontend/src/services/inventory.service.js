import axios from './root.service.js';  // Asegúrate de que axios esté configurado correctamente

// Obtener todos los productos
export async function fetchProducts() {
    const response = await axios.get('/product'); // Se mantiene /product para que coincida con el backend
    return response.data;
}

// Obtener detalles de un producto
export async function fetchProductDetail(id) {
    const response = await axios.get(`/product/detail?id=${id}`); // Se mantiene /product/detail
    return response.data;
}

// Crear un nuevo producto
export async function createProduct(productData) {
    const response = await axios.post('/product', productData); // Se mantiene /product para que coincida con el backend
    return response.data;
}

// Actualizar un producto existente
export async function updateProduct(id, updatedData) {
    const response = await axios.patch(`/product/detail?id=${id}`, updatedData); // Se mantiene /product/detail
    return response.data;
}

// Eliminar un producto
export async function deleteProduct(id) {
    const response = await axios.delete(`/product/detail?id=${id}`); // Se mantiene /product/detail
    return response.data;
}