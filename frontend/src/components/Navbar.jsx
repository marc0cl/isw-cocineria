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
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink
                                to="/finanzas"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Finanzas
                            </NavLink>
                        </li>
                    )}
                    {(userRole === 'administrador' || userRole === 'garzon') && (
                        <li>
                            <NavLink
                                to="/ingresar-ingresos"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Ingresar ingresos
                            </NavLink>
                        </li>
                    )}
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
