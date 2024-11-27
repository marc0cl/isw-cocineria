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
    const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false); // Estado para el submenú de Inventario

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleInventoryMenu = () => {
        setInventoryMenuOpen(!inventoryMenuOpen); // Alterna el submenú de Inventario
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    <li>
                        <NavLink
                            to="/home"
                            onClick={() => setMenuOpen(false)}
                            activeClassName="active"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                        <>
                            <li>
                                <NavLink
                                    to="/users"
                                    onClick={() => setMenuOpen(false)}
                                    activeClassName="active"
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/finanzas"
                                    onClick={() => setMenuOpen(false)}
                                    activeClassName="active"
                                >
                                    Finanzas
                                </NavLink>
                            </li>
                        </>
                    )}
                    {(userRole === 'administrador' || userRole === 'garzon') && (
                        <li>
                            <NavLink
                                to="/ingresar-ingresos"
                                onClick={() => setMenuOpen(false)}
                                activeClassName="active"
                            >
                                Ingresar ingresos
                            </NavLink>
                        </li>
                    )}
                    {(userRole === 'administrador' || userRole === 'usuario') && (
                        <li>
                            <NavLink
                                to="/turnos"
                                onClick={() => setMenuOpen(false)}
                                activeClassName="active"
                            >
                                Turnos
                            </NavLink>
                        </li>
                    )}
                    {/* Submenú de Inventario */}
                    {userRole === 'administrador' && (
                        <li className={`submenu ${inventoryMenuOpen ? 'open' : ''}`}>
                            <NavLink
                                to="#!"
                                onClick={(e) => {
                                    e.preventDefault(); // Evita navegación
                                    toggleInventoryMenu();
                                }}
                                activeClassName="active"
                            >
                                Inventario
                            </NavLink>
                            {inventoryMenuOpen && (
                                <ul className="sub-menu">
                                    <li>
                                        <NavLink
                                            to="/add-product"
                                            onClick={() => setMenuOpen(false)}
                                            activeClassName="active"
                                        >
                                            Agregar producto
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/products"
                                            onClick={() => setMenuOpen(false)}
                                            activeClassName="active"
                                        >
                                            Listado de productos
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/delete-product"
                                            onClick={() => setMenuOpen(false)}
                                            activeClassName="active"
                                        >
                                            Eliminar producto
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/edit-product"
                                            onClick={() => setMenuOpen(false)}
                                            activeClassName="active"
                                        >
                                            Editar producto
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
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

