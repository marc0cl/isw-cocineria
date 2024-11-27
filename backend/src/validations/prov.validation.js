"use strict";
import Joi from "joi";

export const provBodyValidation = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "string.base": "El nombre debe ser de tipo string.",
            "string.min": "El nombre debe tener como mínimo 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 50 caracteres."
        }),
        
    email: Joi.string()
        .email({ tlds: { allow: ['cl'] } })
        .pattern(/@gmail\.cl$/)
        .required()
        .messages({
            "string.empty": "El email no puede estar vacío.",
            "string.email": "El email debe ser un correo válido y terminar en @gmail.cl."
        }),
        
    telefono: Joi.string()
        .length(12)
        .pattern(/^\+56/)
        .required()
        .messages({
            "string.empty": "El teléfono no puede estar vacío.",
            "string.length": "El teléfono debe tener 12 caracteres.",
            "string.pattern.base": "El teléfono debe comenzar con +56."
        }),
        
    direccion: Joi.string()
        .required()
        .messages({
            "string.empty": "La dirección no puede estar vacía.",
            "string.base": "La dirección debe ser de tipo string."
        }),
        
    medioPago: Joi.string()
        .max(50)
        .required()
        .messages({
            "string.empty": "El medio de pago no puede estar vacío.",
            "string.base": "El medio de pago debe ser de tipo string.",
            "string.max": "El medio de pago debe tener como máximo 50 caracteres."
        }),
        
    productos: Joi.string()
        .required()
        .messages({
            "string.empty": "Los productos no pueden estar vacíos.",
            "string.base": "Los productos deben ser de tipo string."
        })
});

export const idValidation = Joi.object({
    id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "any.required": "El id es requerido."
        })
});