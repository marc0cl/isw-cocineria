import React, { useState } from 'react';
import { fetchProducts, updateProduct } from '@services/inventory.service';  

const UpdateProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCode, setSearchCode] = useState(''); // Código para buscar el producto
  const [formData, setFormData] = useState({
    codigoIdentificador: '', // Este se usa solo para referencia en la búsqueda
    nombreProducto: '',
    cantidadProducto: '',
    fechaDeCaducidad: '',
    tipoDeProducto: ''
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const productList = await fetchProducts(); // Obtiene la lista de productos
      const foundProduct = productList.data.find(
        (product) => product.codigoIdentificador === searchCode
      );

      if (foundProduct) {
        setFormData({
          ...foundProduct, // Rellena el formulario con los datos del producto encontrado
          codigoIdentificador: foundProduct.codigoIdentificador // No editable
        });
        setError(null);
      } else {
        setError(`Producto con código "${searchCode}" no encontrado.`);
        setFormData({
          codigoIdentificador: '',
          nombreProducto: '',
          cantidadProducto: '',
          fechaDeCaducidad: '',
          tipoDeProducto: ''
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
      // Se llama a updateProduct pasando el `codigoIdentificador` en la URL y el resto en el body
      await updateProduct(formData.codigoIdentificador, {
        nombreProducto: formData.nombreProducto,
        cantidadProducto: formData.cantidadProducto,
        fechaDeCaducidad: formData.fechaDeCaducidad,
        tipoDeProducto: formData.tipoDeProducto
      });
      alert('Producto actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar el producto');
    }
  };

  return (
    <div className="update-product-page">
      <h1>Actualizar Producto</h1>
      <div>
        <label htmlFor="searchCode">Código Identificador del Producto a Editar</label>
        <input
          type="text"
          id="searchCode"
          name="searchCode"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Buscar Producto
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {formData.codigoIdentificador && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="codigoIdentificador">Código Identificador</label>
            <input
              type="text"
              id="codigoIdentificador"
              name="codigoIdentificador"
              value={formData.codigoIdentificador}
              readOnly // Campo no editable
            />
          </div>
          <div>
            <label htmlFor="nombreProducto">Nombre del Producto</label>
            <input
              type="text"
              id="nombreProducto"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="cantidadProducto">Cantidad</label>
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
            <label htmlFor="fechaDeCaducidad">Fecha de Caducidad</label>
            <input
              type="date"
              id="fechaDeCaducidad"
              name="fechaDeCaducidad"
              value={formData.fechaDeCaducidad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="tipoDeProducto">Tipo de Producto</label>
            <input
              type="text"
              id="tipoDeProducto"
              name="tipoDeProducto"
              value={formData.tipoDeProducto}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Actualizar Producto</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProductPage;
