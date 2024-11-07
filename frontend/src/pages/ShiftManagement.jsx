//import React from 'react';
export const ShiftManagement = () => { 
return (
<div 
    style={{ display: 'flex', minHeight: '100vh' }}
    className="shift-management">
        <aside 
            style={{ width: '300px', padding: '20px', background: '#f4f4f4', fontSize: '16px', color: '#003366' }}>
            <h1>Gestión de Turnos</h1>
        <section 
        className="shift-actions" 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px', marginTop: '20px' }}>
            <button 
                style={{ padding: '10px', fontSize: '16px' }}>
                Listar Turnos
            </button>
            <button
                style={{ padding: '10px', fontSize: '16px' }}>
                Asignar Usuario a Turno
            </button>
            <button
                style={{ padding: '10px', fontSize: '16px' }}>
                Eliminar Turno
            </button>
        </section>
    </aside>
    </div>
    );
};
export default ShiftManagement;
