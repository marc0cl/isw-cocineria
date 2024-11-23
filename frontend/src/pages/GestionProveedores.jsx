import React from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/GestionProveedores.css';

const GestionProveedores = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
  };

    return (
      <div className="gestion-proveedores-container">
        <button className="register-button" onClick={handleRegisterClick}>Registrar Proveedor</button>
      </div>
    );
};

export default GestionProveedores;