"use strict";
import Joi from "joi";

export const expenseQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})
  .required()
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id.",
  });

export const expenseBodyValidation = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.positive": "El monto debe ser un número positivo.",
      "number.precision": "El monto debe tener como máximo dos decimales.",
    }),
  description: Joi.string()
    .max(255)
    .allow("")
    .messages({
      "string.base": "La descripción debe ser de tipo string.",
      "string.max": "La descripción debe tener como máximo 255 caracteres.",
    }),
  source: Joi.string()
    .valid("cocina", "bar", "proveedor", "otros")
    .messages({
      "string.empty": "La fuente no puede estar vacía.",
      "any.only": "La fuente debe ser 'cocina', 'bar', 'proveedor' o 'otros'.",
    }),
})
  .required()
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
