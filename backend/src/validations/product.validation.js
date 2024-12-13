"use strict";
import Joi from "joi";

export const productBodyValidation = Joi.object({
//  codigoIdentificador: Joi.string()
//     .min(1)
//     .max(20)
//     .required()
//     .messages({
//       "string.base": "El código identificador debe ser de tipo string.",
//       "string.empty": "El código identificador no puede estar vacío.",
//       "string.min": "El código identificador debe tener al menos 5 caracteres.",
//       "string.max": "El código identificador no puede exceder los 20 caracteres.",
//     }),
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
      nombreProducto: Joi.string()
        .optional()
        .messages({
          "string.base": "El nombre del producto debe ser de tipo string.",
        }),
    })
      .or("id", "codigoIdentificador", "nombreProducto") // Requiere al menos uno de los tres parámetros
      .unknown(false) // No permite propiedades adicionales
      .messages({

        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos un parámetro: id, codigoIdentificador o nombreProducto.",
      });
  
      export const productBodyUpdateValidation = Joi.object({
        stock: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            "number.base": "El stock debe ser un número.",
            "number.integer": "El stock debe ser un número entero.",
            "number.positive": "El stock debe ser un número positivo.",
          })
          .when('cantidadProducto', {
            is: Joi.exist(), // Si cantidadProducto existe en el body
            then: Joi.number().max(Joi.ref('cantidadProducto')).messages({
              'number.max': 'El stock no puede ser mayor que la cantidad del producto.'
            }),
            otherwise: Joi.number().max(1000).messages({
              'number.max': 'El stock no puede ser mayor a 1000.'
            }) // Si cantidadProducto no existe, puedes aplicar otra validación, si es necesario
          }),
      
        cantidadProducto: Joi.number()
          .integer()
          .positive()
          .optional() // Ya no es requerido
          .messages({
            "number.base": "La cantidad del producto debe ser un número.",
            "number.integer": "La cantidad del producto debe ser un número entero.",
            "number.positive": "La cantidad del producto debe ser un número positivo.",
          }),
      
        fechaDeCaducidad: Joi.date()
          .optional()
          .messages({
            "date.base": "La fecha de caducidad debe ser una fecha válida.",
            "any.required": "La fecha de caducidad es obligatoria.",
          }),
      
        tipoDeProducto: Joi.string()
          .min(3)
          .max(255)
          .optional()
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

