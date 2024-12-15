import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductDetail } from '@services/inventory.service';
import { getProvsService } from '@services/prov.service';
import '../styles/Product.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [providersMap, setProvidersMap] = useState({}); // Mapa de proveedores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [productDetail, setProductDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mapa para el tipo de producto
  const tipoMap = {
    "bebestible": "bar",
    "comestible": "cocina",
    "insumo": "otro"
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar productos
        const response = await fetchProducts();
        if (response.status === "Success") {
          setProducts(response.data);
        } else {
          setError('No se encontraron productos.');
        }

        // Cargar proveedores
        const [provs, provsError] = await getProvsService();
        if (provsError) {
          // Si ocurre un error, lo guardamos en error, pero que siga mostrando productos
          setError(provsError);
        } else if (provs && Array.isArray(provs.data)) {
          // Crear un mapa { [supplierId]: supplierName }
          const map = {};
          provs.data.forEach(prov => {
            map[prov.id] = prov.nombre;
          });
          setProvidersMap(map);
        }
      } catch (err) {
        setError('Error al cargar los productos o proveedores.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products
      .filter((product) =>
          product.nombreProducto.toLowerCase().includes(searchName.toLowerCase())
      )
      .reverse();

  const handleProductClick = async (nombreProducto) => {
    try {
      const details = await fetchProductDetail(nombreProducto);
      setProductDetail(details.data);
      setShowDetailModal(true);

    } catch (err) {
      setError('Error al obtener los detalles del producto.');
    }
  };

  if (loading) return <p>...Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Función para obtener el nombre del proveedor a partir del supplierId
  const getProviderName = (supplierId) => {
    if (!supplierId) return 'No disponible';
    return providersMap[supplierId] || `Proveedor ID: ${supplierId}`;
  };

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
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.nombreProducto)}
                  >
                    <h2>{product.nombreProducto || 'Producto sin nombre'}</h2>
                    <p>
                      <span className="stock-label">Cantidad de Stock: </span>
                      <span
                          className={product.cantidadProducto <= product.minThreshold ? 'stock-value stock-value-low' : 'stock-value stock-value-high'}
                      > {product.cantidadProducto} {product.stockUnit}
                      </span>
                    </p>
                    <p className="min-line">
                      <span className="min-label">Cantidad Mínima: </span>
                      <span className="min-value">{product.minThreshold} {product.stockUnit}</span>
                    </p>

                  </div>
              ))
          )}
        </div>

        {showDetailModal && productDetail && (
            <div className="product-detail-modal">
              <div className="modal-content">
                <h2>{productDetail.nombreProducto}</h2>
                <p><strong>Fecha
                  Ingreso:</strong> {productDetail.createdAt ? new Date(productDetail.createdAt).toLocaleDateString() : 'No disponible'}
                </p>
                <p><strong>Última Actualización:</strong> {productDetail.updatedAt ? new Date(productDetail.updatedAt).toLocaleDateString() : 'No disponible'}</p>
                <p><strong>Stock:</strong> {productDetail.cantidadProducto} {productDetail.stockUnit}</p>
                <p><strong>Tipo de Producto:</strong> {tipoMap[productDetail.tipoDeProducto] || productDetail.tipoDeProducto || 'No especificado'}</p>
                <p><strong>Proveedor:</strong> {getProviderName(productDetail.supplierId)}</p>
                <button onClick={() => setShowDetailModal(false)}>Cerrar</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductPage;
