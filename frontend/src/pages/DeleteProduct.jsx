import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '@services/inventory.service';  
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '../styles/DeleteProduct.css'; // Importa el archivo CSS para aplicar estilos

const DeleteProductPage = () => {
  const [products, setProducts] = useState([]);  // Estado para almacenar los productos
  const [loading, setLoading] = useState(true);  // Estado para controlar el estado de carga
  const [error, setError] = useState(null);  // Estado para manejar errores

  // Cargar los productos cuando el componente se monte
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productList = await fetchProducts();  // Obtiene la lista de productos
        setProducts(productList.data);  // Establece los productos en el estado
        setLoading(false);  // Cambia el estado de carga a false
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        setLoading(false);  // Cambia el estado de carga a false si hay un error
      }
    };

    loadProducts();
  }, []);

  // Manejar la eliminación de un producto por nombreProducto
  const handleDelete = async (nombreProducto) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteProduct(nombreProducto);  // Llama a la función para eliminar el producto
        if(response.status === 'Client error') {
          return showErrorAlert('Error', response.details);
        }
        showSuccessAlert('¡Eliminado!', 'El producto ha sido eliminado correctamente.');  // Muestra un mensaje de éxito
        // Actualiza la lista de productos eliminando el producto por nombreProducto
        setProducts((prevProducts) => prevProducts.filter(product => product.nombreProducto !== nombreProducto));
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el producto.');  // Muestra un mensaje de error
    }
  };

  if (loading) {
    return <p>Cargando productos...</p>;  // Muestra un mensaje mientras se cargan los productos
  }

  if (error) {
    return <p>{error}</p>;  // Muestra el error si no se pueden cargar los productos
  }

  return (
    <div className="delete-product-page">
      <h1>Eliminar Producto</h1>
      {products.length === 0 ? (
        <p>No hay productos para eliminar</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.nombreProducto} className="product-item">
              <h3>{product.nombreProducto}</h3>
              <p>Código: {product.codigoIdentificador}</p>
              <p>Cantidad: {product.cantidadProducto}</p>
              <p>Fecha de caducidad: {product.fechaDeCaducidad}</p>
              <button onClick={() => handleDelete(product.nombreProducto)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteProductPage;
