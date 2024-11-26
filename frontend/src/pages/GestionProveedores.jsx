import React, { useEffect, useState} from "react";
import '../styles/GestionProveedores.css';
import Table from '../components/Table';

const GestionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:24338/api/prov/all/t');
        const data = await response.json();
        console.log(data); // Verifica los datos recibidos
        setProveedores(data.data);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  const handleRegisterClick = () => {
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
        <button className="delete-button">
          <img src="https://img.icons8.com/material-outlined/24/trash--v1.png" alt="Delete" />
          DELETE
        </button>
        <button className="register-button" onClick={handleRegisterClick}>
          <img src="https://img.icons8.com/material-outlined/24/plus--v1.png" alt="Create Icon" />
          Añadir
        </button>
      </div>
      <Table columns={columns} data={proveedores} />
    </div>
  );
};

export default GestionProveedores;