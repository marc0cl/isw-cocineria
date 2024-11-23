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
      <h1>Proveedores</h1>
      <button className="register-button" onClick={handleRegisterClick}>Registrar Proveedor</button>
      <Table columns={columns} data={proveedores} />
    </div>
  );
};

export default GestionProveedores;