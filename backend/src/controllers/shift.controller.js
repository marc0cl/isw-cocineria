"use strict"
import {
    createShiftService,
    deleteShiftService,
    getShiftService,
    getShiftsService,
    updateShiftService,
} from "../services/shift.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { shiftValidation } from "../validations/shift.validation.js";
import { shiftIdValidation } from "../validations/shift.validation.js";

export async function createShift(req,res) {
    try {
        const newShift = req.body;
        const { value, error } = shiftValidation.validate(newShift);

        if (error) return handleErrorClient(res,400,error.message);

        const [shiftSaved,errorShift] = await createShiftService(value);
        
        if(errorShift)return handleErrorClient(res,400,errorShift); 
        handleSuccess(res,201,"Turno creado exitosamente",shiftSaved);
    } catch (error) {
    handleErrorServer(res,500,error.message);

    }
}
export async function getShift(req,res) {
    try {
        const id = req.params.id;
        const { error } = shiftIdValidation.validate({ id });

        if(error) return handleErrorClient(res,400,error.message);

        const [shift, errorShift] = await getShiftService({ id });

        if(errorShift) return handleErrorClient(res,404,errorShift);

        handleSuccess(res,200,"Turno encontrado",shift);
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}
export async function getShifts(req,res) {
    try {
        const [shifts,errorShifts] = await getShiftsService();
        
        if (errorShifts) return handleErrorClient(res,404,errorShifts);
        
    handleSuccess(res,200,"Turnos encontrados",shifts);
        
    } catch (error) {
        handleErrorServer(res,500,error.message);     
    }
}

export async function updateShift(req, res) {
    try {
        const id = req.params.id;
        const { date, startTime, endTime, manager, users } = req.body; 
        const { error: errorUpdate } = shiftValidation.validate({ date, startTime, endTime, manager, users });

        if (errorUpdate) return handleErrorClient(res, 400, "Error de validación en los datos enviados", errorUpdate);

        const [shift, errorShift] = await updateShiftService(id, { date, startTime, endTime, manager, users });

        if (errorShift) return handleErrorClient(res, 400, "Error modificando turno", errorShift);

        handleSuccess(res, 200, "Turno modificado correctamente", shift);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteShift(req, res) {
    try {
        const id = req.params.id;
        const { error } = shiftIdValidation.validate({ id }); 

        if (error) return handleErrorClient(res, 400, error.message);

        const [shiftDelete, errorShiftDelete] = await deleteShiftService({ id });

        if (errorShiftDelete) return handleErrorClient(res, 400, error.message);
        handleSuccess(res, 200, "Turno eliminado exitosamente", shiftDelete);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}