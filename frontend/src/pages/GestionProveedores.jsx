import React, { useEffect, useState} from "react";
import { showSuccessAlert } from "../helpers/sweetAlert";
import Table from '../components/Table';
import ProvForm from "../components/ProvForm";
import '../styles/GestionProveedores.css';
import { getProvsService, addProvService, deleteProvService } from '../services/prov.service.js';

const GestionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      const [data, error] = await getProvsService();
      if (error) {
        console.error('Error fetching proveedores:', error);
      } else {
        setProveedores(data.data);
      }
    };

    fetchProveedores();
  }, []);

  const handleRegisterClick = () => {
    setShowForm(!showForm);
  };
  

  const handleFormSubmit = async (formData) => {
    const [result, error] = await addProvService(formData);
    if (error) {
      console.error('Error registrando proveedor:', error);
    } else {
      console.log('Proveedor registrado:', result);
      setProveedores([...proveedores, result.data]);
      setShowForm(false);
      showSuccessAlert('Registro completado', 'Proveedor añadido correctamente');
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedProveedor) {
      alert('Seleccione un proveedor para eliminar');
      return;
    }

    const [result, error] = await deleteProvService(selectedProveedor.id);
    if (error) {
      console.error('Error eliminando proveedor:', error);
    } else {
      setProveedores(proveedores.filter(prov => prov.id !== selectedProveedor.id));
      setSelectedProveedor(null);
      showSuccessAlert('Eliminación completada', 'Proveedor eliminado correctamente');
    }
  };

  const columns = [
    { title: 'ID', field: 'id' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Email', field: 'email' },
    { title: 'Medio de Pago', field: 'medioPago' },
    { title: 'Productos', field: 'productos' }
  ];


  return (
    <div className="gestion-proveedores-container">
      <h1 className="titulo-proveedores">Proveedores</h1>
      <div className="button-container">
        <button className="delete-button" onClick={handleDeleteClick}>
          <img src="https://img.icons8.com/material-outlined/24/trash--v1.png" alt="Delete" />
          Eliminar
        </button>
        <button className="register-button" onClick={handleRegisterClick}>
          <img src="https://img.icons8.com/material-outlined/24/plus--v1.png" alt="Create Icon" />
          Añadir
        </button>
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleRegisterClick}>&times;</span>
              <ProvForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}
      </div>
      <Table 
        columns={columns} 
        data={proveedores} 
        onSelectionChange={(selectedData) => setSelectedProveedor(selectedData[0])}
      />
    </div>
  );
};

export default GestionProveedores;