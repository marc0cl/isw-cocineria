"use strict";
import Joi from "joi";

export const transactionBodyValidation = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.positive": "El monto debe ser un número positivo.",
      "number.precision": "El monto debe tener como máximo dos decimales.",
      "any.required": "El monto es obligatorio.",
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
    .required()
    .messages({
      "any.only": "La fuente debe ser 'cocina', 'bar', 'proveedor' o 'otros'.",
      "any.required": "La fuente es obligatoria.",
    }),
  type: Joi.string()
    .valid("income", "expense")
    .required()
    .messages({
      "any.only": "El tipo debe ser 'income' o 'expense'.",
      "any.required": "El tipo es obligatorio.",
    }),
})
  .required()
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const transactionQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  source: Joi.string()
    .valid("cocina", "bar", "proveedor", "otros")
    .messages({
      "any.only": "La fuente debe ser 'cocina', 'bar', 'proveedor' o 'otros'.",
    }),
  type: Joi.string()
    .valid("income", "expense")
    .messages({
      "any.only": "El tipo debe ser 'income' o 'expense'.",
    }),
})
  .or("id", "source", "type")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id, source o type.",
  });