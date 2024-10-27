"use strict"
import {
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

export async function getShift(req,res) {
    try {
        
        
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}