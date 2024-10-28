"use strict";
import Joi from "joi";

export const createProvValidation = Joi.object({
    nombre: Joi.string().
        min(3).
        max(50).
        messages({
            "string.empty": "El nombre no puede estar vacío.",
            "string.base": "El nombre debe ser de tipo string.",
            "string.min": "El nombre debe tener como mínimo 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 50 caracteres."}),
            
    email: Joi.string().email().required(),
    telefono: Joi.string().required(),
    direccion: Joi.string().required(),
    medioPago: Joi.string().required(),
    productos: Joi.string().required(),
});