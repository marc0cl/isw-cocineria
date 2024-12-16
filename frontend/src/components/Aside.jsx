import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import '../styles/aside.css';

const Aside = ({ menuOpen }) => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [inventoryOpen, setInventoryOpen] = useState(false);

    const toggleInventoryMenu = (e) => {
        e.preventDefault();
        setInventoryOpen(!inventoryOpen);
    };

    return (
        <aside className={`aside-container ${menuOpen ? 'aside-open' : 'aside-closed'}`}>
            <nav className="aside-nav">
                <ul>
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Usuarios
                            </NavLink>
                        </li>
                    )}
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink to="/finanzas" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Finanzas
                            </NavLink>
                        </li>
                    )}
                    {(userRole === 'administrador' || userRole === 'garzon') && (
                        <li>
                            <NavLink to="/ingresar-ingresos" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Ingresar ingresos
                            </NavLink>
                        </li>
                    )}
                    {(userRole === 'administrador' || userRole === 'usuario') && (
                        <li>
                            <NavLink to="/turnos" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Turnos
                            </NavLink>
                        </li>
                    )}

                    {(userRole === 'administrador' || userRole === 'encargado') && (
                        <li>
                            <NavLink to="/gestion-proveedores" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Gestión Proveedores
                            </NavLink>
                        </li>
                    )}

                    {userRole === 'administrador' && (
                        <li className={`aside-submenu ${inventoryOpen ? 'open' : ''}`}>
                            <a href="#" onClick={toggleInventoryMenu} className={inventoryOpen ? 'active' : ''}>
                                <span>Inventario</span> {inventoryOpen ? <FaChevronDown/> : <FaChevronRight/>}
                            </a>
                            {inventoryOpen && (
                                <ul className="aside-sub-menu">
                                    <li>
                                        <NavLink to="/add-product" className={({ isActive }) => (isActive ? 'active' : '')}>
                                            Agregar producto
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
                                            Listado de productos
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/delete-product" className={({ isActive }) => (isActive ? 'active' : '')}>
                                            Eliminar producto
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/edit-product" className={({ isActive }) => (isActive ? 'active' : '')}>
                                            Editar producto
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Aside;
