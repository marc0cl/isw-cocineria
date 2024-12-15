import React, { useEffect, useState } from 'react';

import { fetchProducts, deleteProduct } from '@services/inventory.service';  
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '../styles/DeleteProduct.css';


const DeleteProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productList = await fetchProducts();
        if (productList.status === "Success") {
          setProducts(productList.data);
        } else {
          setError("No se pudieron cargar los productos.");
        }
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  const handleDelete = async (nombreProducto) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {

        const response = await deleteProduct(nombreProducto);
        if(response.status === 'Client error') {
          return showErrorAlert('Error', response.details);
        }
        showSuccessAlert('¡Eliminado!', 'El producto ha sido eliminado correctamente.');

        setProducts((prevProducts) => prevProducts.filter(product => product.nombreProducto !== nombreProducto));
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (err) {
      console.error('Error al eliminar el producto:', err);

      showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el producto.');

    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="delete-product-page">
      <h1>Eliminar Producto</h1>
      {products.length === 0 ? (
        <p>No hay productos para eliminar</p>
      ) : (
        <ul>
          {products.map((product) => (

            <li key={product.id} className="product-item">

              <h3>{product.nombreProducto}</h3>
              <p>Cantidad: {product.cantidadProducto}</p>

              <p>Fecha de caducidad: {product.fechaDeCaducidad ? new Date(product.fechaDeCaducidad).toLocaleDateString() : 'No disponible'}</p>
              <p>Stock: {product.stock !== undefined ? product.stock : 'No disponible'}</p>
              <p>Estado: {product.estado || 'No disponible'}</p>

              <button onClick={() => handleDelete(product.nombreProducto)}>Eliminar</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteProductPage;
