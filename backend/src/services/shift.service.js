"use strict"
import shift from "../entity/shift.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createShiftService(dataShift) {
    try {
    const shiftRepository = AppDataSource.getRepository(shift);



    const newShift = shiftRepository.create({
        date: dataShift.date,
        startTime: dataShift.startIime,
        endTime: dataShift.endTime,
        users: dataShift.users,
        manager: dataShift.manager.id,
    });
    
    const shiftSaved = await shiftRepository.save(newShift);
    
    return [shiftSaved,null];
    
    } catch (error) {
    console.log("Error de llegada de datos")
    
    }
}

export async function getShiftService(query) {
    try {
        const { id } = query;
        
        const shiftRepository = AppDataSource.getRepository(shift)

        const shiftFound = await  shiftRepository.findOne({
            where: { id: id },
        });

        if(!shiftFound) return [null,"Turno no encontrado"];

        return[shiftFound,null];
    } catch (error) {
        console.error("Error al obtener el turno: ",error);
        return [null, "Error interno del servidor"];
    }
}

export async function getShiftsService() {
    try {
        const shiftRepository = AppDataSource.getRepository(shift);

        const shifts = await shiftRepository.find();

        if(!shifts || shifts.length === 0) return [null,"No hay turnos"]
        
        return [shifts,null]
    } catch (error) {
        console.error("Error al obtener los turnos");
        return [null,"Error interno del servidor"];
    }
}

export async function updateShiftService(query,body){
    try {
        const { id } = query;

        const shiftRepository = AppDataSource.getRepository(shift);

        const shiftFound = await shiftRepository.findOne({
            where:{ id : id } 
        })

        if(!shiftFound) return [null,"Turno no encontrado"];

        const existingShift = await shiftRepository.findOne({
            where: [
                { id: body.id },
                { date: body.date, startTime: body.startTime },
            ]
        })
        
        if (existingShift && existingShift.id !== shiftFound.id) {
            return [null, "Ya existe un turno con el mismo ID o la misma fecha y hora de inicio"];
        }

        const dataShiftUpdate = {
            date:body.date,
            startTime:body.startTime,
            endTime:body.endTime,
            updatedAt: new Date(),
        };

        await shiftRepository.update({ id : shiftFound.id },dataShiftUpdate);

        const shiftData = await shiftRepository.findOne({
            where: { id : shiftFound.id },
        });

        if(!shiftFound){
            return [null,"Turno no encontrado después de actualizar"];
        }
        return [shiftData, null];    
    
    } catch (error) {
        console.log("Error al modificar el turno: ",error);
        return [null,"Error interno del servidor"];        
    }    
}
export async function deleteShiftService(query) {
    try {
        const { id } = query;

        const shiftRepository = AppDataSource.getRepository(shift);

        const shiftFound = await shiftRepository.findOne({
            where: [{ id : id }]
        })

        if(!shiftFound){
            return [null,"Turno no encontrado"]
        }
        const shiftDeleted = await shiftRepository.remove(shiftFound);
        
        return[shiftDeleted,null];
        
    } catch (error) {
        console.error("Error al eliminar un turno",error);
        return [null,"Error interno del servidor"];
    }
    
}