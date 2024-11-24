//import React from "react"
//import { Link } from "react-router-dom"
import ShiftIcon from '../assets/ShiftIcon.svg';
import UsersIcon from '../assets/UsersIcon.svg';
import ArrowIcon from '../assets/ArrowIcon.svg';
import '@styles/homenav.css';
const Home = () => {
  return (
      <nav className='nav'>
        <ul className='list'>
          
        <li className="list__item">
    <div className='list__button'>
        <img src={UsersIcon} alt="Usuarios" />
        <a href="#" className="nav__link">Usuarios</a>
    </div>
</li>

<li className="list__item list__item--click">
    <div className="list__button list__button--click">
        <img src={ShiftIcon} alt="Turnos" />
        <a href="#" className="nav__link">Turnos</a>
        <img src={ArrowIcon} className="list__arrow" alt="Flecha" />
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
  )
}

export default Home
/*          
<Link to="/gestion-turnos" style={{ textDecoration: 'none',color:'#003366'}}>
<h1>Gestion de turnos</h1>
</Link>
*/