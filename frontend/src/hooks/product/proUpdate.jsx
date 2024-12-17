import { useState, useEffect } from 'react';
import { fetchProducts, updateProduct } from '@services/inventory.service';
import { getProvsService } from '@services/prov.service';

const useUpdateProduct = (reloadProducts, updateProductListOrder) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [formData, setFormData] = useState({
    cantidadProducto: '',
    minThreshold: '',
    supplierId: '',
    stockUnit: ''
  });
  const [productFound, setProductFound] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const [data, error] = await getProvsService();
      if (!error) {
        setSuppliers(data.data);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearch = async (searchName) => {
    try {
      setLoading(true);
      const productList = await fetchProducts();
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
    const updateData = {};
    if (formData.cantidadProducto !== '') updateData.cantidadProducto = Number(formData.cantidadProducto);
    if (formData.minThreshold !== '') updateData.minThreshold = Number(formData.minThreshold);
    if (formData.supplierId !== '') updateData.supplierId = Number(formData.supplierId) || null;
    if (formData.stockUnit !== '') updateData.stockUnit = formData.stockUnit;

    try {
      await updateProduct(searchName, updateData);
      alert('Producto actualizado exitosamente');
      await reloadProducts(); // Recargar la lista de productos
      updateProductListOrder(searchName); // Mover el producto actualizado al inicio de la lista
    } catch (err) {
      alert('Error al actualizar el producto');
    }
  };

  return {
    loading,
    error,
    searchName,
    formData,
    productFound,
    suppliers,
    setSearchName,
    handleSearch,
    handleChange,
    handleSubmit,
  };
};

export default useUpdateProduct;
