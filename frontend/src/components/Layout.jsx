import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import Aside from '@components/Aside';

const Layout = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const isLoggedIn = !!user;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {isLoggedIn ? (
                <div className={`home-container ${menuOpen ? 'aside-open' : 'aside-closed'}`}>
                    <Navbar onToggleMenu={toggleMenu} />
                    <Aside menuOpen={menuOpen} />
                    <main className="home-main">
                        <div className="main-content">
                            {/* Pasamos menuOpen y toggleMenu al contexto del Outlet */}
                            <Outlet context={{ menuOpen, toggleMenu }} />
                        </div>
                    </main>
                </div>
            ) : (
                <>
                    <Navbar />
                    <main style={{ width: '100%' }}>
                        <div style={{ width: '100%', boxSizing: 'border-box' }}>
                            <Outlet context={{ menuOpen, toggleMenu }} />
                        </div>
                    </main>
                </>
            )}
        </>
    );
};

export default Layout;
