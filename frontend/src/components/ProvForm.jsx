import React, { useState, useEffect } from 'react';
import '../styles/provform.css';
import { getProvsService } from '../services/prov.service.js';


const ProvForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    medioPago: '',
    productos: ''
  });

  const [errors, setErrors] = useState({});

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

  const isEmailUnique = async (email) => {
    const [response, error] = await getProvsService();
    if (error) {
      console.error('Error fetching providers:', error);
      return false;
    }
    if (!response || !Array.isArray(response.data)) {
      console.error('Invalid data format for providers:', response);
      return false;
    }
    const provs = response.data;
    return !provs.some((prov) => prov.email === email);
  };

  const validate = async () => {
    let newErrors = {};

    if (!formData.nombre) {
      newErrors = { ...newErrors, nombre: 'El nombre es requerido' };
    } else if (formData.nombre.length < 3) {
      newErrors = { ...newErrors, nombre: 'El nombre debe tener al menos 3 caracteres' };
    } else if (formData.nombre.length > 50) {
      newErrors = { ...newErrors, nombre: 'El nombre debe tener como máximo 50 caracteres' };
    }

    if (!formData.direccion) {
      newErrors = { ...newErrors, direccion: 'La dirección es requerida' };
    }

    if (!formData.telefono) {
      newErrors = { ...newErrors, telefono: 'El teléfono es requerido' };
    } else if (formData.telefono.length !== 12) {
      newErrors = { ...newErrors, telefono: 'El teléfono debe tener 12 caracteres' };
    } else if (!formData.telefono.startsWith('+56')) {
      newErrors = { ...newErrors, telefono: 'El teléfono debe comenzar con +56' };
    }

    if (!formData.email) {
      newErrors = { ...newErrors, email: 'El email es requerido' };
    } else if (!formData.email.endsWith('@gmail.cl')) {
      newErrors = { ...newErrors, email: 'El email debe terminar en @gmail.cl' };
    } else if (!(await isEmailUnique(formData.email))) {
      newErrors = { ...newErrors, email: 'El email ya está en uso' };
    }

    if (!formData.medioPago) {
      newErrors = { ...newErrors, medioPago: 'El medio de pago es requerido' };
    } else if (formData.medioPago.length > 50) {
      newErrors = { ...newErrors, medioPago: 'El medio de pago debe tener como máximo 50 caracteres' };
    }

    if (!formData.productos) {
      newErrors = { ...newErrors, productos: 'Los productos son requeridos' };
    }
    
    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="prov-form">
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
        {errors.direccion && <span className="error">{errors.direccion}</span>}
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
        {errors.telefono && <span className="error">{errors.telefono}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>Medio de Pago:</label>
        <input type="text" name="medioPago" value={formData.medioPago} onChange={handleChange} />
        {errors.medioPago && <span className="error">{errors.medioPago}</span>}
      </div>
      <div>
        <label>Productos:</label>
        <input type="text" name="productos" value={formData.productos} onChange={handleChange} />
        {errors.productos && <span className="error">{errors.productos}</span>}
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProvForm;