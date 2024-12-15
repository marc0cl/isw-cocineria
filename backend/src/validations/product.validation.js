"use strict";
import Joi from "joi";

export const productBodyValidation = Joi.object({
  nombreProducto: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre del producto debe ser de tipo string.",
      "string.empty": "El nombre del producto no puede estar vacío.",
      "string.min": "El nombre del producto debe tener al menos 3 caracteres.",
      "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
      "any.required": "El nombre del producto es obligatorio."
    }),
  cantidadProducto: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La cantidad del producto debe ser un número.",
      "number.integer": "La cantidad del producto debe ser un número entero.",
      "number.positive": "La cantidad del producto debe ser un número positivo.",
      "any.required": "La cantidad del producto es obligatoria."
    }),
  fechaDeCaducidad: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de caducidad debe ser una fecha válida.",
      "any.required": "La fecha de caducidad es obligatoria."
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
      "any.required": "El tipo de producto es obligatorio."
    }),
  // Ahora stockUnit puede ser g, kg, mg, t, ml, l, se validará lógicamente en el service
  stockUnit: Joi.string()
    .min(1)
    .max(10)
    .required()
    .messages({
      "string.base": "La unidad de stock debe ser texto.",
      "string.empty": "La unidad de stock no puede estar vacía.",
      "string.min": "La unidad de stock debe tener al menos 1 caracter.",
      "string.max": "La unidad de stock no puede exceder los 10 caracteres.",
      "any.required": "La unidad de stock es obligatoria."
    }),
  minThreshold: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El umbral mínimo debe ser un número.",
      "number.integer": "El umbral mínimo debe ser un número entero.",
      "number.positive": "El umbral mínimo debe ser un número positivo.",
      "any.required": "El umbral mínimo es obligatorio."
    }),
  // Nueva unidad para minThreshold, misma lógica que stockUnit
  minThresholdUnit: Joi.string()
    .min(1)
    .max(10)
    .required()
    .messages({
      "string.base": "La unidad del umbral mínimo debe ser texto.",
      "string.empty": "La unidad del umbral mínimo no puede estar vacía.",
      "string.min": "La unidad del umbral mínimo debe tener al menos 1 caracter.",
      "string.max": "La unidad del umbral mínimo no puede exceder los 10 caracteres.",
      "any.required": "La unidad del umbral mínimo es obligatoria."
    }),
  supplierId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
      "any.required": "El ID del proveedor es obligatorio."
    }),
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
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const productQueryValidation = Joi.object({
  nombreProducto: Joi.string()
    .required()
    .messages({
      "string.base": "El nombre del producto debe ser de tipo string.",
      "any.required": "El nombre del producto es obligatorio."
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar el nombre del producto.",
  });

export const productBodyUpdateValidation = Joi.object({
  cantidadProducto: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "La cantidad del producto debe ser un número.",
      "number.integer": "La cantidad del producto debe ser un número entero.",
      "number.positive": "La cantidad del producto debe ser un número positivo.",
    }),

  minThreshold: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El umbral mínimo debe ser un número.",
      "number.integer": "El umbral mínimo debe ser un número entero.",
      "number.positive": "El umbral mínimo debe ser un número positivo.",
    }),

  supplierId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
    }),

  // El usuario puede mandar: g, kg, mg, t, l, ml (y lo transformaremos a g o ml)
  stockUnit: Joi.string()
    .min(1)
    .max(10)
    .messages({
      "string.base": "La unidad de stock debe ser un texto.",
      "string.min": "La unidad de stock debe tener al menos 1 caracter.",
      "string.max": "La unidad de stock no puede exceder los 10 caracteres."
    })
})
  // Se exige que al menos uno de estos campos esté presente
  .or("cantidadProducto", "minThreshold", "supplierId", "stockUnit")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos uno de los siguientes campos"
      + ": cantidadProducto, minThreshold, supplierId, stockUnit."
  });