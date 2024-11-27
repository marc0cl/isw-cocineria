import { useEffect, useState } from "react";
import { getShiftsService, deleteShiftService, createShiftService } from '@services/shift.service.js';
import { deleteDataAlert, showSuccessAlert, createShiftDataAlert } from "../helpers/sweetAlert";
import '@styles/shift.css';


export default function Shifts() {
    const [shifts, setShifts] = useState([]);
    const [newShift, setNewShift] = useState({
        date: '',
        startTime: '',
        endTime: '',
        manager: '',
        users: '',
    });


    const fetchShifts = async () => {
        try {
            const response = await getShiftsService();
            if (response) {
                setShifts(response);
            } else {
                console.error('No se pudieron cargar los turnos.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('cambios realizados')
        setNewShift((prevData) => ({ ...prevData, [name]: value }));
    };

    
    const handleCreate = async () => {
        try {
            const result =  await createShiftDataAlert();
            if(result.isConfirmed){
                const formattedData = {
                    date: newShift.date,
                    startTime: new Date(`${newShift.date}T${newShift.startTime}:00Z`).toISOString(),
                    endTime: new Date(`${newShift.date}T${newShift.endTime}:00Z`).toISOString(),
                    manager: newShift.manager,  
                    users: newShift.users.split(',').map((id) => parseInt(id.trim())), 
                };
        
                console.log("datos a bakend:", formattedData); 
                await createShiftService(formattedData); 
                showSuccessAlert('¡El turno ha sido creado!')
                fetchShifts(); 
                setNewShift({ date: '', startTime: '', endTime: '', manager: '', users: '' }); 
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const result = await deleteDataAlert();
            if (result.isConfirmed){
                const response = await deleteShiftService(id);
                console.log(response);
                showSuccessAlert('¡Eliminado!','Se ha eliminado el turno'); 
                fetchShifts();
            }else{
                console.log('No se ha podido eliminar el turno');
            }
        } catch (error) {
            console.error('Error al eliminar turno:', error);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    return (
        <div>
            <div>
            <h1>Crear Nuevo Turno</h1>
                <form>
                    <label>
                        Fecha:
                        <input type="date" name="date" value={newShift.date} onChange={handleInputChange} />
                    </label>
                    <label>
                        Hora inicio:
                        <input type="time" name="startTime" value={newShift.startTime} onChange={handleInputChange} />
                    </label>
                    <label>
                        Hora término:
                        <input type="time" name="endTime" value={newShift.endTime} onChange={handleInputChange} />
                    </label>
                    <label>
                        Encargado (ID):
                        <input type="text" name="manager" value={newShift.manager} onChange={handleInputChange} />
                    </label>
                    <label>
                        Usuarios (IDs separados por coma):
                        <input type="text" name="users" value={newShift.users} onChange={handleInputChange} />
                    </label>
                    <button className="button__Create" type="button" onClick={handleCreate}>Crear Turno</button>
                </form>
            </div>
            <h2>Turnos existentes</h2>
            {shifts.length > 0 ? (
                <ul>
                    {shifts.map((shift) => (
                        <div key={shift.id}>
                            <li>
                                <p>Fecha: {shift.date}</p>
                                <p>Hora inicio: {shift.startTime}</p>
                                <p>Hora término: {shift.endTime}</p>
                                <p>Usuarios: {Array.isArray(shift.users) ? shift.users.join(', ') : shift.users}</p>
                                <p>Encargado: {shift.manager}</p>
                            </li>
                            <button className="button__Delete" onClick={() => handleDelete(shift.id)}>Eliminar turno</button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No existen turnos</p>
            )}
        </div>
    );
}
