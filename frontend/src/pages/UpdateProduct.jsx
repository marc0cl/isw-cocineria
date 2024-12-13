import React, { useState } from 'react';
import { fetchProducts, updateProduct } from '@services/inventory.service';  

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState(''); // Nombre para buscar el producto
  const [formData, setFormData] = useState({
    stock: ''
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const productList = await fetchProducts(); // Obtiene la lista de productos
      const foundProduct = productList.data.find(
        (product) => product.nombreProducto.toLowerCase() === searchName.toLowerCase()
      );

      if (foundProduct) {
        setFormData({
          stock: foundProduct.stock
        });
        setError(null);
      } else {
        setError(`Producto con nombre "${searchName}" no encontrado.`);
        setFormData({
          stock: ''
        });
      }
      setLoading(false);
    } catch (err) {
      setError("Error al buscar el producto.");
      setLoading(false);
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

    try {
      // Se llama a updateProduct pasando el `nombreProducto` en la URL y el stock en el body
      await updateProduct(searchName, {
        stock: formData.stock
      });
      alert('Stock actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar el stock');
    }
  };

  return (
    <div className="update-product-page">
      <h1>Actualizar Stock del Producto</h1>
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
      {formData.stock && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Actualizar Stock</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProductPage;
