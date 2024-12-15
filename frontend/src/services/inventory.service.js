import axios from './root.service.js';

// Obtener todos los productos
export async function fetchProducts() {
    const response = await axios.get('/product');
    return response.data;
}

// Obtener detalles de un producto por nombreProducto
export async function fetchProductDetail(nombreProducto) {
    const response = await axios.get(`/product/detail?nombreProducto=${nombreProducto}`);
    return response.data;
}

// Crear un nuevo producto
export async function createProduct(productData) {
    const response = await axios.post('/product', productData);
    return response.data;
}

// Actualizar un producto existente por nombreProducto
export async function updateProduct(nombreProducto, updatedData) {
    const response = await axios.patch(`/product/detail?nombreProducto=${nombreProducto}`, updatedData);
    return response.data;
}

// Eliminar un producto por nombreProducto
export async function deleteProduct(nombreProducto) {
    const response = await axios.delete(`/product/detail?nombreProducto=${nombreProducto}`);
    return response.data;
}

// Obtener productos críticos
export async function getCriticalProductsService() {
    try {
        const response = await axios.get('/product/critical');
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

// Actualizar stock tras venta
export async function updateProductStock(ingredientsArray) {
    try {
        const response = await axios.post('/product/update-stock', { ingredients: ingredientsArray });
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

// Verificar disponibilidad
export async function checkAvailabilityService(menu) {
    const body = {
        products: menu.map(item => ({
            name: item.name,
            ingredients: item.ingredients
        }))
    };

    try {
        const response = await axios.post('/product/check-availability', body);
        return [response.data.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}
