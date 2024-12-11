import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  const userRole = user?.rol;

  return (
    <div className="home-container">
      <aside className="home-aside">
        <nav className="home-nav">
          <ul>
            {(userRole === 'administrador' || userRole === 'encargado') && (
              <li>
                <Link to="/gestion-proveedores">
                  Gestión de proveedores
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
      <main className="home-main">
        {}
      </main>
    </div>
  );
}
export default Home