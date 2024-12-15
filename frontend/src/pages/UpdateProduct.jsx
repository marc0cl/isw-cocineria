import React, { useState, useEffect } from 'react';
import { fetchProducts, updateProduct } from '@services/inventory.service';
import { getProvsService } from '@services/prov.service';

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState(''); // Nombre para buscar el producto
  const [formData, setFormData] = useState({
    cantidadProducto: '',
    minThreshold: '',
    supplierId: '',
    stockUnit: ''
  });
  const [productFound, setProductFound] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Cargar la lista de proveedores
    const fetchSuppliers = async () => {
      const [data, error] = await getProvsService();
      if (!error) {
        setSuppliers(data.data);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const productList = await fetchProducts(); // Obtiene la lista de productos
      const found = productList.data.find(
          (product) => product.nombreProducto.toLowerCase() === searchName.toLowerCase()
      );

      if (found) {
        setFormData({
          cantidadProducto: found.cantidadProducto || '',
          minThreshold: found.minThreshold || '',
          supplierId: found.supplierId || '',
          stockUnit: found.stockUnit || ''
        });
        setProductFound(found);
        setError(null);
      } else {
        setError(`Producto con nombre "${searchName}" no encontrado.`);
        setFormData({
          cantidadProducto: '',
          minThreshold: '',
          supplierId: '',
          stockUnit: ''
        });
        setProductFound(null);
      }
      setLoading(false);
    } catch (err) {
      setError("Error al buscar el producto.");
      setLoading(false);
      setProductFound(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar objeto con solo campos que se quieren actualizar
    // En este caso, enviamos todos porque la validación del backend lo permite
    const updateData = {};
    if (formData.cantidadProducto !== '') updateData.cantidadProducto = Number(formData.cantidadProducto);
    if (formData.minThreshold !== '') updateData.minThreshold = Number(formData.minThreshold);
    if (formData.supplierId !== '') updateData.supplierId = Number(formData.supplierId) || null;
    if (formData.stockUnit !== '') updateData.stockUnit = formData.stockUnit;

    try {
      await updateProduct(searchName, updateData);
      alert('Producto actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar el producto');
    }
  };

  return (
      <div className="update-product-page">
        <h1>Actualizar Datos del Producto</h1>
        <div>
          <label htmlFor="searchName">Nombre del Producto a Editar</label>
          <input
              type="text"
              id="searchName"
              name="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleSearch} disabled={loading}>
            Buscar Producto
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {productFound && (
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
                    placeholder="g/kg/mg/t o ml/l"
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
                  <option value="null">Sin proveedor</option>
                </select>
              </div>
              <button type="submit">Actualizar</button>
            </form>
        )}
      </div>
  );
};

export default UpdateProductPage;
