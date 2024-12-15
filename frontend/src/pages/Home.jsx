import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/home.css';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx'; // importar el navbar

const Home = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    useNavigate();
    const [menuOpen, setMenuOpen] = useState(true);    // Controla el aside (expandido/colapsado)
    const [inventoryOpen, setInventoryOpen] = useState(false); // Submenú Inventario
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleInventoryMenu = (e) => {
        e.preventDefault();
        setInventoryOpen(!inventoryOpen);
    };

    return (
        <div className={`home-container ${menuOpen ? 'aside-open' : 'aside-closed'}`}>
            <Navbar onToggleMenu={toggleMenu} />
            <aside className="home-aside">
                <nav className="home-nav">
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
                        {userRole === 'administrador' && (
                            <li className={`submenu ${inventoryOpen ? 'open' : ''}`}>
                                <a href="#" onClick={toggleInventoryMenu} className={inventoryOpen ? 'active' : ''}>
                                    <span>Inventario</span> {inventoryOpen ? <FaChevronDown /> : <FaChevronRight />}
                                </a>
                                {inventoryOpen && (
                                    <ul className="sub-menu">
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
            <main className="home-main">
                <div className="main-content">
                    <h1>Contenido Principal</h1>
                    <p>Aquí va el contenido del centro de la página.</p>
                </div>
            </main>
        </div>
    );
};

export default Home;
