
import axios from './root.service.js';


// Obtener todos los productos
export async function fetchProducts() {
    const response = await axios.get('/product'); // Se mantiene /product para que coincida con el backend
    return response.data;
}


// Obtener detalles de un producto por nombreProducto
export async function fetchProductDetail(nombreProducto) {
  const response = await axios.get(`/product/detail?nombreProducto=${nombreProducto}`); // Cambia el parámetro a nombreProducto
  return response.data;
}



// Crear un nuevo producto
export async function createProduct(productData) {
    const response = await axios.post('/product', productData); // Se mantiene /product para que coincida con el backend
    console.log(productData);
    return response.data;
}

// Actualizar un producto existente
export async function updateProduct(nombreProducto, updatedData) {
  try {
    // Corrigiendo la URL para usar nombreProducto
    const response = await axios.patch(`/product/detail?nombreProducto=${nombreProducto}`, updatedData);

    // Log para verificar la llamada
    console.log("Llamada a updateProduct con:", { nombreProducto, updatedData });

    return response.data;
  } catch (error) {
    console.error("Error en updateProduct:", error.response || error);
    throw error;
  }
}

// Eliminar un producto

export async function deleteProduct(nombreProducto) {
  const response = await axios.delete(`/product/detail?nombreProducto=${nombreProducto}`); // Cambiar el parámetro a nombreProducto
  return response.data;

}
