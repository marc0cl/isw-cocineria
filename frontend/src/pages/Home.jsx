// Home.jsx
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/home.css';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import { fetchMenuDefault } from '../services/menu.service.js';

const Home = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const userRole = user?.rol;
    useNavigate();

    // Obtenemos menuOpen y toggleMenu desde el Outlet context
    const { menuOpen, toggleMenu } = useOutletContext();

    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [menuData, setMenuData] = useState(null);

    const toggleInventoryMenu = (e) => {
        e.preventDefault();
        setInventoryOpen(!inventoryOpen);
    };

    useEffect(() => {
        fetchMenuDefault()
            .then(data => {
                setMenuData(data.menu);
            })
            .catch(error => {
                console.error('Error al cargar el menú:', error);
            });
    }, []);

    const groupBySource = (items) => {
        return items.reduce((acc, item) => {
            if (!acc[item.source]) {
                acc[item.source] = [];
            }
            acc[item.source].push(item);
            return acc;
        }, {});
    };

    const renderMenuCards = () => {
        if (!menuData) {
            return <p>Cargando menú...</p>;
        }

        const allItems = [...menuData.on_stock, ...menuData.out_of_stock];
        const groupedItems = groupBySource(allItems);

        return (
            <div className="menu-container" style={{ padding: '20px' }}>
                <h1>Menú</h1>
                {Object.keys(groupedItems).map(source => (
                    <div key={source} className="menu-section">
                        <h2 style={{ textTransform: 'capitalize' }}>{source}</h2>
                        <div className="menu-items">
                            {groupedItems[source].map((item, index) => {
                                const isOutOfStock = item.amount === 0;
                                return (
                                    <div
                                        key={index}
                                        className="menu-card"
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            backgroundColor: isOutOfStock ? '#eee' : '#fff',
                                            opacity: isOutOfStock ? 0.5 : 1
                                        }}
                                    >
                                        <h3>{item.name}</h3>
                                        <p>Precio: ${item.price}</p>
                                        <p>Cantidad Disponible: {item.amount}</p>
                                        <p>Ingredientes: {item.ingredients.join(', ')}</p>
                                        {isOutOfStock && <p><em>Actualmente sin stock</em></p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const isLoggedIn = !!user;

    return (
        isLoggedIn ? (
            <div>
                {/* Ya no llamamos a <Navbar> aquí, pues está en Layout */}
                <aside className="home-aside">
                    <nav className="home-nav">
                        <ul>
                            {userRole === 'administrador' && (
                                <li>
                                    <NavLink to="/users">Usuarios</NavLink>
                                </li>
                            )}
                            {userRole === 'administrador' && (
                                <li>
                                    <NavLink to="/finanzas">Finanzas</NavLink>
                                </li>
                            )}
                            {(userRole === 'administrador' || userRole === 'garzon') && (
                                <li>
                                    <NavLink to="/ingresar-ingresos">Ingresar ingresos</NavLink>
                                </li>
                            )}
                            {(userRole === 'administrador' || userRole === 'usuario') && (
                                <li>
                                    <NavLink to="/turnos">Turnos</NavLink>
                                </li>
                            )}
                            {(userRole === 'administrador' || userRole === 'encargado') && (
                                <li>
                                    <NavLink to="/gestion-proveedores">Gestión Proveedores</NavLink>
                                </li>
                            )}
                            {userRole === 'administrador' && (
                                <li className={`submenu ${inventoryOpen ? 'open' : ''}`}>
                                    <a href="#" onClick={toggleInventoryMenu} className={inventoryOpen ? 'active' : ''}>
                                        <span>Inventario</span> {inventoryOpen ? <FaChevronDown/> : <FaChevronRight/>}
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
                <main className="home-main">
                    <div className="main-content">
                        {renderMenuCards()}
                    </div>
                </main>
            </div>
        ) : (
            <>
                {/* Aquí tampoco llamamos a <Navbar> porque ya está en Layout */}
                <main className="home-main" style={{ marginLeft: '0' }}>
                    <div className="main-content" style={{ width: '100%', boxSizing: 'border-box' }}>
                        {renderMenuCards()}
                    </div>
                </main>
            </>
        )
    );
};

export default Home;
