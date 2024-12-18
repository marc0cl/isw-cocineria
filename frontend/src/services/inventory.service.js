import axios from './root.service.js';


export async function fetchProducts() {
    const response = await axios.get('/product');
    return response.data;
}


export async function fetchProductDetail(nombreProducto) {
    const response = await axios.get(`/product/detail?nombreProducto=${nombreProducto}`);
    return response.data;
}


export async function createProduct(productData) {
    const response = await axios.post('/product', productData);
    return response.data;
}


export async function updateProduct(nombreProducto, updatedData) {
    const response = await axios.patch(`/product/detail?nombreProducto=${nombreProducto}`, updatedData);
    return response.data;
}


export async function deleteProduct(nombreProducto) {
    const response = await axios.delete(`/product/detail?nombreProducto=${nombreProducto}`);
    return response.data;
}
