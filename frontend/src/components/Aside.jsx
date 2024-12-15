import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const Aside = ({ menuOpen }) => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [inventoryOpen, setInventoryOpen] = useState(false);

    const toggleInventoryMenu = (e) => {
        e.preventDefault();
        setInventoryOpen(!inventoryOpen);
    };

    return (
        <aside className="home-aside">
            <nav className="home-nav">
                <ul>
                    {userRole === 'administrador' && (
                        <li><NavLink to="/users">Usuarios</NavLink></li>
                    )}
                    {userRole === 'administrador' && (
                        <li><NavLink to="/finanzas">Finanzas</NavLink></li>
                    )}
                    {(userRole === 'administrador' || userRole === 'garzon') && (
                        <li><NavLink to="/ingresar-ingresos">Ingresar ingresos</NavLink></li>
                    )}
                    {(userRole === 'administrador' || userRole === 'usuario') && (
                        <li><NavLink to="/turnos">Turnos</NavLink></li>
                    )}
                    {userRole === 'administrador' && (
                        <li className={`submenu ${inventoryOpen ? 'open' : ''}`}>
                            <a href="#" onClick={toggleInventoryMenu} className={inventoryOpen ? 'active' : ''}>
                                <span>Inventario</span> {inventoryOpen ? <FaChevronDown /> : <FaChevronRight />}
                            </a>
                            {inventoryOpen && (
                                <ul className="sub-menu">
                                    <li><NavLink to="/add-product">Agregar producto</NavLink></li>
                                    <li><NavLink to="/products">Listado de productos</NavLink></li>
                                    <li><NavLink to="/delete-product">Eliminar producto</NavLink></li>
                                    <li><NavLink to="/edit-product">Editar producto</NavLink></li>
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
