import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import Aside from '@components/Aside';

const Layout = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className={`home-container ${menuOpen ? 'aside-open' : 'aside-closed'}`}>
            <Navbar onToggleMenu={toggleMenu} />
            <Aside menuOpen={menuOpen} />
            <main className="home-main">
                <div className="main-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
