import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct } from '@services/inventory.service';  

const UpdateProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    codigoIdentificador: '',
    nombreProducto: '',
    cantidadProducto: '',
    fechaDeCaducidad: '',
    tipoDeProducto: ''
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productList = await fetchProducts();
        setProducts(productList.data);
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product.codigoIdentificador);
    setFormData({
      codigoIdentificador: product.codigoIdentificador,
      nombreProducto: product.nombreProducto,
      cantidadProducto: product.cantidadProducto,
      fechaDeCaducidad: product.fechaDeCaducidad,
      tipoDeProducto: product.tipoDeProducto
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Console log para depuración
    console.log("Datos enviados:", formData);

    try {
      await updateProduct(formData.codigoIdentificador, formData);  
      alert('Producto actualizado exitosamente');
      
      setProducts(prevProducts => prevProducts.map(product => 
        product.codigoIdentificador === formData.codigoIdentificador 
        ? { ...product, ...formData } 
        : product
      ));

      setEditProduct(null);
    } catch (err) {
      alert('Error al actualizar el producto');
    }
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="update-product-page">
      <h1>Lista de Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.codigoIdentificador} className="product-item">
              <h3>{product.nombreProducto}</h3>
              <p>Código: {product.codigoIdentificador}</p>
              <p>Cantidad: {product.cantidadProducto}</p>
              <p>Fecha de caducidad: {product.fechaDeCaducidad}</p>
              {editProduct === product.codigoIdentificador ? (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="codigoIdentificador">Código Identificador</label>
                    <input
                      type="text"
                      id="codigoIdentificador"
                      name="codigoIdentificador"
                      value={formData.codigoIdentificador}
                      onChange={handleChange}
                      required
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
              ) : (
                <button onClick={() => handleEdit(product)}>Actualizar</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdateProductPage;
