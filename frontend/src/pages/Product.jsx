import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductDetail } from '@services/inventory.service'; // Asegúrate de importar ambos servicios
import '../styles/Product.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState(''); // Estado para almacenar el nombre de búsqueda
  const [productDetail, setProductDetail] = useState(null); // Estado para almacenar los detalles de un producto
  const [showDetailModal, setShowDetailModal] = useState(false); // Estado para mostrar el modal de detalles

  // useEffect para cargar los productos desde el servicio
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

  // Filtramos los productos según el nombre ingresado
  const filteredProducts = products
    .filter((product) =>
      product.nombreProducto.toLowerCase().includes(searchName.toLowerCase())
    )
    .reverse(); // Reversamos la lista de productos filtrados

  // Función para obtener los detalles de un producto por nombreProducto
  const handleProductClick = async (nombreProducto) => {
    try {
      const details = await fetchProductDetail(nombreProducto); // Llamamos al servicio para obtener los detalles
      setProductDetail(details); // Almacenamos los detalles en el estado
      setShowDetailModal(true); // Mostramos el modal
    } catch (err) {
      setError('Error al obtener los detalles del producto.');
    }
  };

  // Renderizado condicional: si está cargando, mostramos el mensaje de carga
  if (loading) return <p>...Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="product-page">
      <h1>Listado de Productos</h1>

      {/* Campo de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre de producto"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)} // Actualizamos el estado con el valor del input
        />
      </div>

      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p>No se encontraron productos con ese nombre.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.nombreProducto} // Cambiado de `id` a `nombreProducto`
              className="product-card"
              onClick={() => handleProductClick(product.nombreProducto)} // Maneja el clic para obtener los detalles
            >
              <h2>{product.nombreProducto || 'Producto sin nombre'}</h2>
              {/* Se eliminó la línea que muestra el código del producto */}
              <p>Cantidad: {product.cantidadProducto || 0}</p>
              <p>Fecha de Caducidad: {product.fechaDeCaducidad ? new Date(product.fechaDeCaducidad).toLocaleDateString() : 'No disponible'}</p>
              <p>Tipo de Producto: {product.tipoDeProducto || 'No especificado'}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalles del producto */}
      {showDetailModal && productDetail && (
        <div className="product-detail-modal">
          <div className="modal-content">
            <h2>{productDetail.nombreProducto}</h2>
            {/* Se eliminó la línea que muestra el código del producto */}
            <p><strong>Cantidad:</strong> {productDetail.cantidadProducto}</p>
            <p><strong>Fecha de Caducidad:</strong> {new Date(productDetail.fechaDeCaducidad).toLocaleDateString()}</p>
            <p><strong>Tipo de Producto:</strong> {productDetail.tipoDeProducto}</p>
            <p><strong>Descripción:</strong> {productDetail.descripcion || 'No disponible'}</p>
            <button onClick={() => setShowDetailModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
