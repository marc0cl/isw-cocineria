import React, { useState } from "react";
import { showSuccessAlert, deleteDataAlert } from "../helpers/sweetAlert";
import ProvForm from "../components/ProvForm";
import ProvSearch from "../components/ProvSearch";
import '../styles/GestionProveedores.css';
import { useProveedores } from '@hooks/providers/useProveedores';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import updateIcon from '../assets/updateIcon.svg';
import XIcon from '../assets/XIcon.svg';

const GestionProveedores = () => {
  const {
    filteredProveedores,
    selectedProveedor,
    setSelectedProveedor,
    isEditing,
    setIsEditing,
    searchTerm,
    setSearchTerm,
    searchBy,
    setSearchBy,
    handleAdd,
    handleUpdate,
    handleDelete,
    getProductsForSupplier
  } = useProveedores();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoProveedor, setSelectedInfoProveedor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  const handleRegisterClick = () => {
    setShowForm(true);
    setIsEditing(false);
    setSelectedProveedor(null);
  };

  const handleEditClick = (prov) => {
    setSelectedProveedor(prov);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDeleteClick = async (prov) => {
    setSelectedProveedor(prov);
    const confirm = await deleteDataAlert('¿Estás seguro?', '¡No podrás revertir esto!');
    if (!confirm.isConfirmed) {
      return;
    }

    await handleDelete();
    showSuccessAlert('Eliminación completada', 'Proveedor eliminado correctamente');
  };

  const handleFormSubmit = async (formData) => {
    if (isEditing && selectedProveedor) {
      await handleUpdate(formData);
      showSuccessAlert('Actualización completada', 'Proveedor actualizado correctamente');
    } else {
      await handleAdd(formData);
      showSuccessAlert('Registro completado', 'Proveedor añadido correctamente');
    }
    setShowForm(false);
  };

  const handleProvClick = (prov) => {
    setSelectedInfoProveedor(prov);
    setShowInfoModal(true);
  }

  const toggleDropdown = (provId) => {
    setOpenDropdowns(prevOpenDropdowns => {
      const newSet = new Set(prevOpenDropdowns);
      if (newSet.has(provId)) {
        newSet.delete(provId);
      } else {
        newSet.add(provId);
      }
      return newSet;
    });
  };

  const isDropdownOpen = (provId) => openDropdowns.has(provId);

  return (
    <div className="gestion-proveedores-container">
      <h1>Listado de Proveedores</h1>

      <div className="search-and-add-container">
        <ProvSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          searchBy={searchBy}
          onSearchByChange={(e) => setSearchBy(e.target.value)}
        />
        <button className="add-button" onClick={handleRegisterClick}>+</button>
      </div>

      {showForm && (
        <div className="modalgp">
          <div className="modalgp-content">
            <span className="close" onClick={() => setShowForm(false)}>&times;</span>
            <ProvForm onSubmit={handleFormSubmit} initialData={isEditing ? selectedProveedor : null} isEditing={isEditing} />
          </div>
        </div>
      )}

      <div className="prov-list">
        {filteredProveedores.length === 0 ? (
          <p>No se encontraron proveedores con ese nombre.</p>
        ) : (
          filteredProveedores.map((prov) => {
            const productos = getProductsForSupplier(prov.id);
            return (
              <div key={prov.id} className="prov-card" onClick={() => handleProvClick(prov)}>
                <h2>{prov.nombre}</h2>
                <div className="prov-actions">
                  <button className="icon-button" onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(prov);
                  }}>
                    <img src={updateIcon} alt="Editar" className="icon-img" />
                  </button>
                  <button className="icon-button" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(prov);
                  }}>
                    <img src={XIcon} alt="Borrar" className="icon-img" />
                  </button>
                  <button className="inventory-button" onClick={(e) => {
                    toggleDropdown(prov.id)
                    e.stopPropagation();
                  }}>
                    <span>Inventario</span> {isDropdownOpen(prov.id) ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </div>

                {isDropdownOpen(prov.id) && (
                  <div className="productos-dropdown">
                    <ul>
                      {productos.length > 0 ? (
                        productos.map(product => (
                          <li key={product.id}>
                            <strong>{product.nombreProducto}</strong><br />
                            Stock: {product.cantidadProducto} {product.stockUnit}<br />
                            Caducidad: {product.fechaDeCaducidad}<br />
                          </li>
                        ))
                      ) : (
                        <li>No hay productos para este proveedor.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {showInfoModal && selectedInfoProveedor && (
        <div className="modalgp">
          <div className="modalgp-content">
            <span className="close" onClick={() => setShowInfoModal(false)}>&times;</span>
            <h2>Información del Proveedor</h2>
            <p><strong>Nombre:</strong> {selectedInfoProveedor.nombre}</p>
            <p><strong>Dirección:</strong> {selectedInfoProveedor.direccion}</p>
            <p><strong>Teléfono:</strong> {selectedInfoProveedor.telefono}</p>
            <p><strong>Email:</strong> {selectedInfoProveedor.email}</p>
            <p><strong>Medio de Pago:</strong> {selectedInfoProveedor.medioPago}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProveedores;
