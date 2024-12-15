"use strict";
import Product from "../entity/product.entity.js";
import Prov from "../entity/prov.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { addTransactionService } from "./transaction.service.js";

// Funciones auxiliares para conversión de unidades a la base (g o ml)
function convertToGrams(value, unit) {
  switch (unit) {
    case "g":
      return value;
    case "kg":
      return value * 1000;
    case "mg":
      return value / 1000;
    case "t":
      return value * 1000000;
    default:
      throw new Error("Unidad de medida de masa no válida.");
  }
}

function convertToMl(value, unit) {
  switch (unit) {
    case "ml":
      return value;
    case "l":
      return value * 1000;
    default:
      throw new Error("Unidad de medida de volumen no válida.");
  }
}

export async function getProductService(query) {
  try {
    const { nombreProducto } = query;

    const productRepository = AppDataSource.getRepository(Product);

    const productFound = await productRepository.findOne({
      where: { nombreProducto: nombreProducto },
    });
    if (!productFound) return [null, "producto no encontrado"];
    return [productFound, null];

  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return [null, "error interno del servidor"];
  }
}

export async function getProductsService() {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    if (!products || products.length === 0) return [null, "no hay productos "];
    return [products, null];
  } catch (error) {
    console.error("error al obtener los productos", error);
    return [null, "error interno del servidor"];
  }
}

export async function updateProductService(query, body) {
  try {
    const { nombreProducto } = query;
    const productRepository = AppDataSource.getRepository(Product);
    const provRepository = AppDataSource.getRepository(Prov);

    if (!nombreProducto) {
      return [null, "El nombre del producto es requerido para actualizar el producto"];
    }

    const productFound = await productRepository.findOne({
      where: { nombreProducto },
    });

    if (!productFound) {
      return [null, "Producto no encontrado"];
    }

    // Transformación de stockUnit si se envía
    let finalStockUnit = productFound.stockUnit;
    let finalCantidadProducto = productFound.cantidadProducto;

    if (body.stockUnit) {
      const unit = body.stockUnit.toLowerCase().trim();
      const groupG = ["g", "kg", "mg", "t"];
      const groupML = ["ml", "l"];

      // Si el usuario también envía cantidadProducto, la convertimos
      if (body.cantidadProducto !== undefined && !isNaN(Number(body.cantidadProducto))) {
        const cantidadNum = Number(body.cantidadProducto);

        if (groupG.includes(unit)) {
          finalStockUnit = "g";
          finalCantidadProducto = convertToGrams(cantidadNum, unit);
        } else if (groupML.includes(unit)) {
          finalStockUnit = "ml";
          finalCantidadProducto = convertToMl(cantidadNum, unit);
        } else {
          return [null, "Unidad de medida no válida. Use g/kg/mg/t o ml/l."];
        }
      } else {
        // Si no se manda cantidadProducto pero sí la unidad, solo actualizamos la unidad
        // sin cambiar la cantidad, pues no hay valor nuevo que convertir.
        // Sin embargo, esto puede resultar en inconsistencia si la unidad cambia
        // sin cambiar la cantidad. Podrías decidir no permitir esto.
        return [null, "Debe enviar cantidadProducto al cambiar la unidad de medida"];
      }
    } else if (body.cantidadProducto !== undefined) {
      // Si se manda la cantidad pero no la unidad, se asume que es la misma unidad que ya estaba
      const cantidadNum = Number(body.cantidadProducto);
      if (isNaN(cantidadNum)) {
        return [null, "La cantidadProducto debe ser un número."];
      }

      // Convertir según la unidad original del producto
      if (finalStockUnit === "g") {
        // Se asume que ya viene en gramos
        finalCantidadProducto = cantidadNum;
      } else if (finalStockUnit === "ml") {
        // Se asume que ya viene en ml
        finalCantidadProducto = cantidadNum;
      } else {
        return [null, "La unidad actual del producto no es válida."];
      }
    }

    // Validar supplierId si se envía
    let finalSupplierId = productFound.supplierId;
    if (body.supplierId !== undefined) {
      if (body.supplierId === null) {
        finalSupplierId = null;
      } else {
        const supplierFound = await provRepository.findOne({ where: { id: body.supplierId } });
        if (!supplierFound) {
          return [null, "El proveedor especificado no existe."];
        }
        finalSupplierId = body.supplierId;
      }
    }

    const dataProductUpdate = {
      cantidadProducto: finalCantidadProducto,
      minThreshold: body.minThreshold !== undefined ? body.minThreshold : productFound.minThreshold,
      supplierId: finalSupplierId,
      stockUnit: finalStockUnit,
      updatedAt: new Date(),
    };

    await productRepository.update({ nombreProducto }, dataProductUpdate);
    const updatedProduct = await productRepository.findOne({
      where: { nombreProducto },
    });

    return [updatedProduct, null];
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteProductService(query) {
  try {
    const { nombreProducto } = query;

    const productRepository = AppDataSource.getRepository(Product);

    const productFound = await productRepository.findOne({
      where: { nombreProducto: nombreProducto },
    });

    if (!productFound) return [null, "Producto no encontrado"];

    const productDeleted = await productRepository.remove(productFound);

    return [productDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}

function generateCodigoIdentificador() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 20;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// Crear producto

export async function createProductService(productData) {
  const productRepository = AppDataSource.getRepository(Product);
  const provRepository = AppDataSource.getRepository(Prov);

  let {
    nombreProducto,
    cantidadProducto,
    fechaDeCaducidad,
    tipoDeProducto,
    stockUnit,
    minThreshold,
    minThresholdUnit,
    supplierId,
    cost
  } = productData;

  if (!nombreProducto || cantidadProducto === undefined || stockUnit === undefined) {
    return [null, "Faltan datos del producto (nombreProducto, cantidadProducto, stockUnit)."];
  }

  const cantidadNum = Number(cantidadProducto);
  if (isNaN(cantidadNum)) {
    return [null, "La cantidadProducto debe ser un número."];
  }

  const minThresholdNum = Number(minThreshold);
  if (isNaN(minThresholdNum)) {
    return [null, "El minThreshold debe ser un número."];
  }

  const unitStock = stockUnit.toLowerCase().trim();
  const unitThreshold = minThresholdUnit.toLowerCase().trim();
  const groupG = ["g", "kg", "mg", "t"];
  const groupML = ["ml", "l"];

  // Determinar el tipo base de stockUnit
  let finalStockUnit, finalCantidadProducto, finalMinThreshold;

  // Si es unidad de masa
  if (groupG.includes(unitStock)) {
    finalStockUnit = "g";

    // Ambas unidades deben ser del mismo tipo (masas)
    if (!groupG.includes(unitThreshold)) {
      return [null, "La unidad del umbral mínimo debe ser del mismo tipo que la unidad de stock (masa o volumen)."];
    }

    finalCantidadProducto = convertToGrams(cantidadNum, unitStock);
    finalMinThreshold = convertToGrams(minThresholdNum, unitThreshold);

  } else if (groupML.includes(unitStock)) {
    finalStockUnit = "ml";

    // Ambas unidades deben ser del mismo tipo (volumen)
    if (!groupML.includes(unitThreshold)) {
      return [null, "La unidad del umbral mínimo debe ser del mismo tipo que la unidad de stock (masa o volumen)."];
    }

    finalCantidadProducto = convertToMl(cantidadNum, unitStock);
    finalMinThreshold = convertToMl(minThresholdNum, unitThreshold);
  } else {
    return [null, "Unidad de medida no válida para stockUnit. Use g/kg/mg/t o ml/l."];
  }

  // Generar codigoIdentificador automáticamente
  function generateCodigoIdentificador() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 20;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const codigoIdentificador = generateCodigoIdentificador();

  // Verificar si el codigoIdentificador está en uso
  const existingProduct = await productRepository.findOne({
    where: { codigoIdentificador },
  });
  if (existingProduct) {
    return [null, { dataInfo: "codigoIdentificador", message: "Código identificador en uso" }];
  }

  // Verificar si existe el proveedor
  if (supplierId !== undefined && supplierId !== null) {
    const provFound = await provRepository.findOne({ where: { id: supplierId } });
    if (!provFound) {
      return [null, "No existe un proveedor con el id proporcionado."];
    }
  }

  // Crear el expense
  if (cost === undefined || isNaN(Number(cost))) {
    return [null, "El costo es requerido y debe ser un número válido."];
  }

  const newExpenseData = [{
    amount: cost,
    description: `Compra de ${nombreProducto}`,
    source: `${tipoDeProducto}`,
    type: "expense"
  }];

  const [newExpense, errorNewExpense] = await addTransactionService(newExpenseData);
  if (errorNewExpense) {
    return [null, "Error al crear el gasto asociado al producto."];
  }

  const expenseCreated = newExpense[0];

  const newProduct = productRepository.create({
    codigoIdentificador,
    nombreProducto,
    cantidadProducto: finalCantidadProducto,
    fechaDeCaducidad,
    tipoDeProducto,
    stockUnit: finalStockUnit,   // almacenamos sólo "g" o "ml"
    minThreshold: finalMinThreshold, // almacenamos el umbral ya convertido
    supplierId,
    expenseId: expenseCreated.id,
  });

  await productRepository.save(newProduct);

  return [newProduct, null];
}

export async function getCriticalProductsService() {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const provRepository = AppDataSource.getRepository(Prov);

    const products = await productRepository.find();
    if (!products || products.length === 0) return [[], null];

    const critical = products.filter(p => p.cantidadProducto < p.minThreshold);

    if (critical.length === 0) {
      return [[], null];
    }

    const provs = await provRepository.find();
    const provMap = {};
    provs.forEach(prov => {
      provMap[prov.id] = prov.nombre;
    });

    const criticalWithProvName = critical.map(prod => ({
      ...prod,
      supplierName: prod.supplierId ? provMap[prod.supplierId] || "N/A" : "N/A"
    }));

    return [criticalWithProvName, null];
  } catch (error) {
    console.error("Error al obtener productos críticos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateStockService(ingredients) {
  try {
    const productRepository = AppDataSource.getRepository(Product);

    for (const ing of ingredients) {
      const productFound = await productRepository.findOne({
        where: { nombreProducto: ing.name }
      });
      if (productFound) {
        const newAmount = productFound.cantidadProducto - ing.amount;
        if (newAmount < 0) {
          return [null, `Stock insuficiente para ${ing.name}`];
        }
        productFound.cantidadProducto = newAmount;
        productFound.updatedAt = new Date();
        await productRepository.save(productFound);
      } else {
        return [null, `Producto ${ing.name} no encontrado en inventario`];
      }
    }

    return ["OK", null];
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function checkAvailabilityService(products) {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const results = [];

    for (const prod of products) {
      const { name, ingredients } = prod;

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        results.push({ name, available: false, maxQuantity: 0 });
        continue;
      }

      let maxQuantity = Infinity;

      for (const ing of ingredients) {
        const ingName = ing.name.trim();
        const ingAmount = ing.amount;

        const stockItem = await productRepository.findOne({
          where: { nombreProducto: ingName }
        });

        if (!stockItem || stockItem.cantidadProducto < ingAmount) {
          maxQuantity = 0;
          break;
        } else {
          const currentMax = Math.floor(stockItem.cantidadProducto / ingAmount);
          if (currentMax < maxQuantity) {
            maxQuantity = currentMax;
          }
        }
      }

      results.push({
        name,
        available: maxQuantity > 0,
        maxQuantity: maxQuantity > 0 ? maxQuantity : 0
      });
    }

    return [results, null];
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    return [null, "Error interno del servidor"];
  }
}
