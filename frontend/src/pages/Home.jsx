//import React from "react"
//import { Link } from "react-router-dom"
import ShiftIcon from '../assets/ShiftIcon.svg';
import UsersIcon from '../assets/UsersIcon.svg';
import ArrowIcon from '../assets/ArrowIcon.svg';
import '@styles/homenav.css';
const Home = () => {
  return (
    <div style={{ display: 'flex' , minHeight: '100vh'}}>
    <aside style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
      <nav className='nav'>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          
          <li style={{ display: 'flex'}} className="list__item">
            
            <div>
              
              <img src={UsersIcon} className="nav__link" />
              <a href="#" className="nav__link">Gestión de Usuarios</a>
        
            </div>

          </li>

          <li className="list__item">
            <div className="list__button list__button--click">
              <img src={ShiftIcon} alt="" />
              <a href="#" className="nav__link">Gestión de Turnos</a>
              <img src={ArrowIcon} className="list__arrow" />
            </div>

            <ul className="list__show">

              <li className="list__inside">
                <a href="#" className="nav__link nav__link--inside">Listar Turnos</a>
              </li>

              <li className="list__inside">
                <a href="#" className="nav__link nav__link--inside">Asignar Turno a Usuario</a>
              </li>

              <li className="list__inside">
                <a href="#" className="nav__link nav__link--inside">Eliminar Turno</a>
              </li>
              
            </ul>

          </li>

        </ul>
      </nav>
    </aside>
    <main style={{ flex: 1, padding: '20px' }}>
      {}
    </main>
  </div>
  
  )
}

export default Home
/*          
<Link to="/gestion-turnos" style={{ textDecoration: 'none',color:'#003366'}}>
<h1>Gestion de turnos</h1>
</Link>
*/