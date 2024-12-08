import React, { useEffect, useState} from "react";
import { showSuccessAlert, deleteDataAlert } from "../helpers/sweetAlert";
import Table from '../components/Table';
import ProvForm from "../components/ProvForm";
import '../styles/GestionProveedores.css';
import { getProvsService, addProvService, deleteProvService, updateProvService } from '../services/prov.service.js';

const GestionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setShowForm(true);
    setIsEditing(false);
    selectedProveedor(null);
  };
  
  const handleEditClick = () => {
    if (!selectedProveedor) {
      alert('Seleccione un proveedor para editar');
      return;
    }
    setShowForm(true);
    setIsEditing(true);
  };

  const handleFormSubmit = async (formData) => {
    if (isEditing) {
      const [result, error] = await updateProvService(selectedProveedor.id, formData);
      if (error) {
        console.error('Error actualizando proveedor:', error);
      } else {
        console.log('Proveedor actualizado:', result);
        setProveedores(proveedores.map(prov => (prov.id === selectedProveedor.id ? result.data : prov)));
        setShowForm(false);
        setSelectedProveedor(null);
        showSuccessAlert('Actualización completada', 'Proveedor actualizado correctamente');
      }
    } else {
    const [result, error] = await addProvService(formData);
      if (error) {
        console.error('Error registrando proveedor:', error);
      } else {
        console.log('Proveedor registrado:', result);
        setProveedores([...proveedores, result.data]);
        setShowForm(false);
        showSuccessAlert('Registro completado', 'Proveedor añadido correctamente');
      }
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedProveedor) {
      alert('Seleccione un proveedor para eliminar');
      return;
    }

    const confirm = await deleteDataAlert('¿Estás seguro?', '¡No podrás revertir esto!');
    if (!confirm.isConfirmed) {
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
        <button className="update-button" onClick={handleEditClick}>
          <img src="https://img.icons8.com/material-outlined/24/synchronize.png" alt="Update Icon" />
          Editar
        </button>
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowForm(false)}>&times;</span>
              <ProvForm onSubmit={handleFormSubmit} initialData={isEditing ? selectedProveedor : null}/>
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