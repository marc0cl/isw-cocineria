import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);
    const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false); // Nuevo estado para el submenú de Inventario

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const toggleInventoryMenu = () => {
        setInventoryMenuOpen(!inventoryMenuOpen); // Alterna el estado del submenú de Inventario
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    <li>
                        <NavLink 
                            to="/home" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink 
                                to="/users" 
                                onClick={() => { 
                                    setMenuOpen(false); 
                                    addActiveClass();
                                }} 
                                activeClassName="active"
                            >
                                Usuarios
                            </NavLink>
                        </li>
                    )}
                    {/* Opción de Inventario con submenú */}
                    <li className={`submenu ${inventoryMenuOpen ? 'open' : ''}`}>
                        <NavLink 
                            to="#!" 
                            onClick={(e) => { 
                                e.preventDefault(); // Evita la navegación por defecto
                                toggleInventoryMenu(); // Toggle del submenú
                            }} 
                            activeClassName="active"
                        >
                            Inventario
                        </NavLink>
                        {inventoryMenuOpen && (
                            <ul className="sub-menu">
                                {/* Opción para agregar un producto */}
                                <li>
                                    <NavLink 
                                        to="/add-product" // Enlace para agregar producto
                                        onClick={() => { 
                                            setMenuOpen(false); 
                                            addActiveClass();
                                        }} 
                                        activeClassName="active"
                                    >
                                        Agregar producto
                                    </NavLink>
                                </li>
                                {/* Opción para listar los productos */}
                                <li>
                                    <NavLink 
                                        to="/products" // Enlace para listar productos
                                        onClick={() => { 
                                            setMenuOpen(false); 
                                            addActiveClass();
                                        }} 
                                        activeClassName="active"
                                    >
                                        Listado de productos
                                    </NavLink>
                                </li>
                                {/* Opción para eliminar un producto */}
                                <li>
                                    <NavLink 
                                        to="/delete-product" // Enlace para eliminar producto
                                        onClick={() => { 
                                            setMenuOpen(false); 
                                            addActiveClass();
                                        }} 
                                        activeClassName="active"
                                    >
                                        Eliminar producto
                                    </NavLink>
                                </li>
                                {/* Opción para editar un producto */}
                                <li>
                                    <NavLink 
                                        to="/edit-product" // Enlace para editar producto
                                        onClick={() => { 
                                            setMenuOpen(false); 
                                            addActiveClass();
                                        }} 
                                        activeClassName="active"
                                    >
                                        Editar producto
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                            activeClassName="active"
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
