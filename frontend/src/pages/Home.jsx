//import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div style={{ display: 'flex' , minHeight: '100vh'}}>
    <aside style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <Link to="/gestion-turnos" style={{ textDecoration: 'none', color: 'Blue',fontsize: 20 ,padding:10 }}>
              Gestion de Turnos
            </Link>
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