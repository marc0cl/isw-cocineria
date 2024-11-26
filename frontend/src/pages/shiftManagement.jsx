//import { Outlet } from 'react-router-dom'; 
import { useEffect, useState } from "react";
import { getShiftsService, deleteShiftService, createShiftService } from '@services/shift.service.js';
//import { updateShiftService } from '@services/shift.service.js';
export default function Shifts (){
    const [shifts, setShifts] = useState([]);

    const fetchShifts = async () => {
        try {
            const response = await getShiftsService();
            if (response) {
                setShifts(response);
            } else {
                console.error('No se pudieron cargar los turnos.');
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    };
    
/*
    const handleUpdate = async(data,id) =>{
        try {
            
        } catch (error) {
            console.error('Error: ',error)
            
        }
    }
*/

    const handleDelete = async(id) =>{
        try {
            const response = await deleteShiftService(id);
            console.log("Turno eliminado: ", response);
        } catch (error) {
            console.error('Error: ',error)
        }
    }
    useEffect(() => {
        fetchShifts();
    },[])

    return (
            
            <div className="div">
                <h1>pagina de turno prueba</h1>
                {shifts.length > 0 ? (
                <ul>
                    {shifts.map((shift)  => (
                        <div key={shift.id}>
                            <li>
                                <p>Fecha: {shift.date} </p>
                                <p>Hora inicio: {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                <p>Hora termino: {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                <p>Usuarios: {Array.isArray(shift.users) ? shift.users.join(', ') : shift.users}</p>
                                <p>Encargado: {shift.manager} </p>
                            </li>
                            <button onClick={() => handleDelete(shift.id)}>Eliminar turno</button>
                            <button >Editar turno</button>        
                        </div>            
                    ))}
                </ul>
                ) : (
                    <p>No existen turnos</p>
                )}
            </div>
        );
        
}

