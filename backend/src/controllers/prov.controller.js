"use strict";
import { handleErrorServer, handleSuccess } from "../handlers/responseHandlers";
import { createProvService } from "../services/prov.service";

export async function createProv(req, res) {
    try {
        const prov = req.body;

        const provSaved = await createProvService(prov);

        handleSuccess(res, 201, "Proveedor creado exitosamente", provSaved);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}