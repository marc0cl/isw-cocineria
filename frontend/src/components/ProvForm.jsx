import React, { useState, useEffect } from 'react';
import '../styles/provform.css';


const ProvForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    medioPago: '',
    productos: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="prov-form">
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Medio de Pago:</label>
        <input type="text" name="medioPago" value={formData.medioPago} onChange={handleChange} />
      </div>
      <div>
        <label>Productos:</label>
        <input type="text" name="productos" value={formData.productos} onChange={handleChange} />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProvForm;