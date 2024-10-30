"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createProvService, getProvService, getProvsService, updateProvService, deleteProvService } from "../services/prov.service.js";
import { provBodyValidation, idValidation } from "../validations/prov.validation.js";

export async function createProv(req, res) {
    try {
        const prov = req.body;

        const { value, error } = provBodyValidation.validate(prov);

        if (error) return handleErrorClient(res, 400, error.message);

        const provSaved = await createProvService(value);

        handleSuccess(res, 201, "Proveedor creado exitosamente", provSaved);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getProv(req, res) {
    try {
        const { id } = req.params;

        const { error } = idValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);

        const [prov, errorProv] = await getProvService(id);

        if (errorProv) return handleErrorClient(res, 404, errorProv);

        handleSuccess(res, 200, "Proveedor encontrado", prov);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getProvs(req, res) {
    try {
        const { id } = req.params;
        
        if (id && isNaN(Number(id))) {
            return handleErrorClient(res, 400, "El i debe ser un número.");
        }

        const [provs, errorProvs] = await getProvsService();

        if (errorProvs) return handleErrorClient(res, 404, errorProvs);

        provs.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Proveedores encontrados", provs);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateProv(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;

        const { error } = idValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);

        const [prov, errorProv] = await getProvService(id);

        if (errorProv) return handleErrorClient(res, 404, errorProv);

        const provUpdated = await updateProvService(id, body);

        handleSuccess(res, 200, "Proveedor actualizado", provUpdated);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteProv(req, res) {
    try {
        const { id } = req.params;

        const { error } = idValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);

        const [prov, errorProv] = await getProvService(id);

        if (errorProv) return handleErrorClient(res, 404, errorProv);

        await deleteProvService(id);

        handleSuccess(res, 204, "Proveedor eliminado");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}