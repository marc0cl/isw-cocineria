//import React from 'react';
//import { Form } from "react-router-dom";
export const ShiftManagement = () => { 
return (
    <div className="shift-management">
        <aside style={{ width: '300px', padding: '20px', background: '#f4f4f4' }}>
        <h1>Gestión de Turnos</h1>
    <section className="shift-actions">
        <button>
            Listar Turnos
        </button>

        <button>
            Asignar Usuario a Turno
        </button>

        <button>
            Eliminar Turno
        </button>

    </section>
        </aside>
    </div>
);
};
export default ShiftManagement;
