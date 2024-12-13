import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductDetail } from '@services/inventory.service';
import '../styles/Product.css';



const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [productDetail, setProductDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        if (response.status === "Success") {
          console.log(response.data)
          setProducts(response.data);
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
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.nombreProducto.toLowerCase().includes(searchName.toLowerCase())
    )
    .reverse();

  const handleProductClick = async (nombreProducto) => {
    try {
      const details = await fetchProductDetail(nombreProducto);
      setProductDetail(details);
      setShowDetailModal(true);
    } catch (err) {
      setError('Error al obtener los detalles del producto.');
    }
  };

  if (loading) return <p>...Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="product-page">
      <h1>Listado de Productos</h1>

      <div className="search-container">
        <input
          type="text"

          placeholder="Buscar por nombre de producto"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div className="product-list">
        {filteredProducts.length === 0 ? (

          <p>No se encontraron productos con ese nombre.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.nombreProducto}
              className="product-card"
              onClick={() => handleProductClick(product.nombreProducto)}
            >
              <h2>{product.nombreProducto || 'Producto sin nombre'}</h2>
              <p>Cantidad: {product.cantidadProducto || 0}</p>
              <p>Fecha de Caducidad: {product.fechaDeCaducidad ? new Date(product.fechaDeCaducidad).toLocaleDateString() : 'No disponible'}</p>
              <p>Tipo de Producto: {product.tipoDeProducto || 'No especificado'}</p>
              <p>Stock: {product.stock !== undefined ? product.stock : 'No disponible'}</p> {/* Mostrar el stock */}
              <p>Estado: {product.estado || 'No disponible'}</p> {/* Mostrar el estado */}
            </div>
          ))
        )}
      </div>

      {showDetailModal && productDetail && (
        <div className="product-detail-modal">
          <div className="modal-content">
            <h2>{productDetail.nombreProducto}</h2>
            <p><strong>Cantidad:</strong> {productDetail.cantidadProducto}</p>
            <p><strong>Fecha de Caducidad:</strong> {new Date(productDetail.fechaDeCaducidad).toLocaleDateString()}</p>
            <p><strong>Tipo de Producto:</strong> {productDetail.tipoDeProducto}</p>
            <p><strong>Descripción:</strong> {productDetail.descripcion || 'No disponible'}</p>
            <p><strong>Stock:</strong> {productDetail.stock !== undefined ? productDetail.stock : 'No disponible'}</p> {/* Mostrar el stock en el detalle */}
            <p><strong>Estado:</strong> {productDetail.estado || 'No disponible'}</p> {/* Mostrar el estado en el detalle */}
            <button onClick={() => setShowDetailModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

