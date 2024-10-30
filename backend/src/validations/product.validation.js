"use strict";
import Joi from "joi";

export const productBodyValidation = Joi.object({
  codigoIdentificador: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.base": "El código identificador debe ser de tipo string.",
      "string.empty": "El código identificador no puede estar vacío.",
      "string.min": "El código identificador debe tener al menos 5 caracteres.",
      "string.max": "El código identificador no puede exceder los 20 caracteres.",
    }),
  nombreProducto: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre del producto debe ser de tipo string.",
      "string.empty": "El nombre del producto no puede estar vacío.",
      "string.min": "El nombre del producto debe tener al menos 3 caracteres.",
      "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
    }),
  cantidadProducto: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La cantidad del producto debe ser un número.",
      "number.integer": "La cantidad del producto debe ser un número entero.",
      "number.positive": "La cantidad del producto debe ser un número positivo.",
    }),
  fechaDeCaducidad: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de caducidad debe ser una fecha válida.",
      "any.required": "La fecha de caducidad es obligatoria.",
    }),
  tipoDeProducto: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "El tipo de producto debe ser de tipo string.",
      "string.empty": "El tipo de producto no puede estar vacío.",
      "string.min": "El tipo de producto debe tener al menos 3 caracteres.",
      "string.max": "El tipo de producto no puede exceder los 255 caracteres.",
    }),

})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debe proporcionar al menos un campo válido.",
  });
  
  export const productQueryValidation = Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
      }),
    codigoIdentificador: Joi.string()
      .min(5)
      .max(20)
      .messages({
        "string.base": "El código identificador debe ser de tipo string.",
        "string.min": "El código identificador debe tener al menos 5 caracteres.",
        "string.max": "El código identificador no puede exceder los 20 caracteres.",
      }),
  })
    .or("id", "codigoIdentificador") // Requiere al menos uno de los dos parámetros
    .unknown(false)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
      "object.missing": "Debes proporcionar al menos un parámetro: id o codigoIdentificador.",
    });
  