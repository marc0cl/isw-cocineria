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
    console.log(productData);
    return response.data;
}

// Actualizar un producto existente
export async function updateProduct(codigoIdentificador, updatedData) {
  try {
    // Corrigiendo la URL para usar codigoIdentificador
    const response = await axios.patch(`/product/detail?codigoIdentificador=${codigoIdentificador}`, updatedData);

    // Log para verificar la llamada
    console.log("Llamada a updateProduct con:", { codigoIdentificador, updatedData });

    return response.data;
  } catch (error) {
    console.error("Error en updateProduct:", error.response || error);
    console.log(data);
    throw error;
  }
}

// Eliminar un producto
export async function deleteProduct(id) {
    const response = await axios.delete(`/product/detail?id=${id}`); // Se mantiene /product/detail
    return response.data;
}
