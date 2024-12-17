import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductDetail } from '@services/inventory.service';
import { getProvsService } from '@services/prov.service';

import useDeleteProduct from '../hooks/product/proDelete';

import useUpdateProduct from '../hooks/product/proUpdate';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';

import '../styles/Product.css';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [providersMap, setProvidersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [productDetail, setProductDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const reloadProducts = async () => {
    const response = await fetchProducts();
    if (response.status === "Success") {
      setProducts(response.data);
    }
  };

  const updateProductListOrder = (updatedProductName) => {
    setProducts((prevProducts) => {
      const updatedProductIndex = prevProducts.findIndex(product => product.nombreProducto === updatedProductName);
      if (updatedProductIndex !== -1) {
        const updatedProduct = prevProducts[updatedProductIndex];
        const newProductList = [updatedProduct, ...prevProducts.slice(0, updatedProductIndex), ...prevProducts.slice(updatedProductIndex + 1)];
        return newProductList;
      }
      return prevProducts;
    });
  };

  const {
    loading: updating,
    error: updateError,
    searchName: updateSearchName,
    formData,
    productFound,
    suppliers,
    setSearchName: setUpdateSearchName,
    handleSearch,
    handleChange,
    handleSubmit,
  } = useUpdateProduct(reloadProducts, updateProductListOrder);

  const { handleDelete } = useDeleteProduct(setProducts);

  const tipoMap = {
    "bebestible": "bar",
    "comestible": "cocina",
    "insumo": "otro"
  };

  const { handleDelete } = useDeleteProduct(setProducts);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchProducts();
        if (response.status === "Success") {
          setProducts(response.data);
        } else {
          setError('No se encontraron productos.');
        }

        const [provs, provsError] = await getProvsService();
        if (provsError) {
          setError(provsError);
        } else if (provs && Array.isArray(provs.data)) {
          const map = {};
          provs.data.forEach((prov) => {
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

  const handleUpdateClick = (nombreProducto) => {
    setUpdateSearchName(nombreProducto);
    handleSearch(nombreProducto);
    setShowUpdateModal(true);
  };

  if (loading) return <p>...Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
            <div key={product.id} className="product-card">
              <div
                className="product-info"
                onClick={() => handleProductClick(product.nombreProducto)}
              >
                <h2>{product.nombreProducto || 'Producto sin nombre'}</h2>
                <p>
                  <span className="stock-label">Cantidad de Stock: </span>
                  <span
                    className={
                      product.cantidadProducto <= product.minThreshold
                        ? 'stock-value stock-value-low'
                        : 'stock-value stock-value-high'
                    }
                  >
                    {product.cantidadProducto} {product.stockUnit}
                  </span>
                </p>
                <p className="min-line">
                  <span className="min-label">Cantidad Mínima: </span>
                  <span className="min-value">{product.minThreshold} {product.stockUnit}</span>
                </p>
              </div>
              <div className="product-actions">
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.nombreProducto);
                  }}
                >
                  <img src={DeleteIcon} alt="delete" />
                </button>
                <button
                  className="update-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateClick(product.nombreProducto);
                  }}
                  disabled={updating}
                >
                  <img src={UpdateIcon} alt="update" />
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {showDetailModal && productDetail && (
        <div className="product-detail-modal">
          <div className="modal-content">
            <h2>{productDetail.nombreProducto}</h2>
            <p><strong>Fecha Ingreso:</strong> {productDetail.createdAt ? new Date(productDetail.createdAt).toLocaleDateString() : 'No disponible'}</p>
            <p><strong>Última Actualización:</strong> {productDetail.updatedAt ? new Date(productDetail.updatedAt).toLocaleDateString() : 'No disponible'}</p>
            <p><strong>Stock:</strong> {productDetail.cantidadProducto} {productDetail.stockUnit}</p>
            <p><strong>Tipo de Producto:</strong> {tipoMap[productDetail.tipoDeProducto] || productDetail.tipoDeProducto || 'No especificado'}</p>
            <p><strong>Proveedor:</strong> {getProviderName(productDetail.supplierId)}</p>
            <button onClick={() => setShowDetailModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showUpdateModal && productFound && (
        <div className="product-detail-modal">
          <div className="modal-content">
            <h2>Actualizar Producto: {productFound.nombreProducto}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="cantidadProducto">Cantidad del Producto</label>
                <input
                  type="number"
                  id="cantidadProducto"
                  name="cantidadProducto"
                  value={formData.cantidadProducto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="minThreshold">Umbral Mínimo</label>
                <input
                  type="number"
                  id="minThreshold"
                  name="minThreshold"
                  value={formData.minThreshold}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="stockUnit">Unidad de Stock</label>
                <input
                  type="text"
                  id="stockUnit"
                  name="stockUnit"
                  value={formData.stockUnit}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="supplierId">Proveedor</label>
                <select
                  id="supplierId"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.nombre}</option>
                  ))}
                </select>
              </div>
              <button type="submit">Actualizar</button>
            </form>
            <button onClick={() => setShowUpdateModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
