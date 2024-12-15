import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/auth"
                        onClick={logoutSubmit}
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        Cerrar sesión
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
