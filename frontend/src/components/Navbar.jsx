import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { FaBars } from 'react-icons/fa';
import '../styles/navbar.css'

const Navbar = ({ onToggleMenu }) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const isLoggedIn = !!user; // si existe user, está logueado

    const logoutSubmit = () => {
        logout();
        navigate('/auth');
    };

    return (
        <nav className="navbar">
            {isLoggedIn && (
                <button className="hamburger-btn" onClick={onToggleMenu}>
                    <FaBars />
                </button>
            )}
            <ul>
                {isLoggedIn ? (
                    <>
                        <li>
                            <NavLink to="/home">Inicio</NavLink>
                        </li>
                        <li>
                            <NavLink to="/auth" onClick={logoutSubmit}>Cerrar sesión</NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/auth">Iniciar sesión</NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
