"use strict";
import Joi from "joi";

export const productBodyValidation = Joi.object({
  codigoIdentificador: Joi.string()
    .min(1)
    .max(20)
    .required(),
  nombreProducto: Joi.string()
    .min(3)
    .max(255)
    .required(),
  cantidadProducto: Joi.number()
    .integer()
    .positive()
    .required(),
  fechaDeCaducidad: Joi.date()
    .required(),
  tipoDeProducto: Joi.string()
    .min(3)
    .max(255)
    .required(),
  stockUnit: Joi.string()
    .valid("g", "ml")
    .required(),
  minThreshold: Joi.number()
    .integer()
    .positive()
    .required(),
  supplierId: Joi.number()
    .integer()
    .positive()
    .required(),
  cost: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "El costo debe ser un número.",
      "number.positive": "El costo debe ser un número positivo.",
      "number.precision": "El costo debe tener como máximo dos decimales.",
      "any.required": "El costo es obligatorio."
    })
})
  .unknown(false);

export const productQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive(),
  codigoIdentificador: Joi.string()
    .min(5)
    .max(20),
})
  .or("id", "codigoIdentificador")
  .unknown(false);

export const productBodyUpdateValidation = Joi.object({
  nombreProducto: Joi.string()
    .min(3)
    .max(255)
    .required(),
  cantidadProducto: Joi.number()
    .integer()
    .positive()
    .required(),
  fechaDeCaducidad: Joi.date()
    .required(),
  tipoDeProducto: Joi.string()
    .min(3)
    .max(255)
    .required(),
  stockUnit: Joi.string()
    .valid("g", "ml")
    .required(),
  minThreshold: Joi.number()
    .integer()
    .positive()
    .required(),
  supplierId: Joi.number()
    .integer()
    .positive()
    .allow(null)
})
  .unknown(false);
