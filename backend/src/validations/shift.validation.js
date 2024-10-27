"use strict";
import Joi from "joi";


export const shiftValidation = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "number.positive": "El id debe ser un número positivo.",
        }),


    date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La fecha debe ser una fecha válida.",
            "date.format": "La fecha debe estar en formato YYYY-MM-DD.",
        }),


    startTime: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La hora de inicio debe ser una fecha y hora válida.",
            "date.format": "La hora de inicio debe estar en formato ISO 8601.",
        }),


    endTime: Joi.date()
        .iso()
        .greater(Joi.ref("startTime")) // Verifica que `endTime` sea posterior a `startTime`
        .required()
        .messages({
            "date.base": "La hora de término debe ser una fecha y hora válida.",
            "date.format": "La hora de término debe estar en formato ISO 8601.",
            "date.greater": "La hora de término debe ser posterior a la hora de inicio.",
        }),


    manager: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del encargado debe ser un número.",
            "number.integer": "El ID del encargado debe ser un número entero.",
            "number.positive": "El ID del encargado debe ser un número positivo.",
            "any.required": "El turno debe tener un encargado (manager) asignado.",
        }),


    users: Joi.array()
        .items(
            Joi.number()
                .integer()
                .positive()
                .messages({
                    "number.base": "El ID del usuario debe ser un número.",
                    "number.integer": "El ID del usuario debe ser un número entero.",
                    "number.positive": "El ID del usuario debe ser un número positivo.",
                })
        )
        .min(1) 
        .required()
        .messages({
            "array.base": "La lista de usuarios debe ser un arreglo.",
            "array.min": "Debe haber al menos un usuario asignado al turno.",
            "any.required": "El turno debe tener usuarios asignados.",
        }),
});
