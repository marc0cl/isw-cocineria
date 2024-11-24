import React, { useEffect, useState } from 'react';
import { fetchProducts } from '@services/inventory.service'; // O el nombre correcto de tu servicio

const ProductPage = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos useEffect para cargar los productos desde el servicio
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts(); // Llamamos a la función que obtiene los productos
        if (response.status === "Success") {
          setProducts(response.data); // Guardamos solo la data (el array de productos)
        } else {
          setError('No se encontraron productos.');
        }
      } catch (err) {
        setError('Error al cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // El array vacío significa que se ejecutará solo al montar el componente

  // Renderizado condicional: si está cargando, mostramos el mensaje de carga
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-page">
      <h1>Listado de Productos</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.nombreProducto}</h2>
              <p>Código: {product.codigoIdentificador}</p>
              <p>Cantidad: {product.cantidadProducto}</p>
              <p>Fecha de Caducidad: {new Date(product.fechaDeCaducidad).toLocaleDateString()}</p>
              <p>Tipo de Producto: {product.tipoDeProducto}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPage;
