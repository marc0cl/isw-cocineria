import axios from './root.service.js';

// Obtener todos los productos
export async function fetchProducts() {
    const response = await axios.get('/product');
    return response.data;
}

// Obtener detalles de un producto
export async function fetchProductDetail(id) {
    const response = await axios.get(`/product/detail?id=${id}`);
    return response.data;
}

// Crear un nuevo producto
export async function createProduct(productData) {
    const response = await axios.post('/product', productData);
    return response.data;
}

// Actualizar un producto existente
export async function updateProduct(id, updatedData) {
    const response = await axios.patch(`/product/detail?id=${id}`, updatedData);
    return response.data;
}

// Eliminar un producto
export async function deleteProduct(id) {
    const response = await axios.delete(`/product/detail?id=${id}`);
    return response.data;
}
