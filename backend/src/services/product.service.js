"user strict";
import Product from "../entity/product.entity.js";
import Prov from "../entity/prov.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { addTransactionService } from "./transaction.service.js";

export async function getProductService(query) {
  try {
    const { id, codigoIdentificador } = query;
    const productRepository = AppDataSource.getRepository(Product);

    const productFound = await productRepository.findOne({
      where: [
        { id: id },
        { codigoIdentificador: codigoIdentificador }
      ],
    });
    if (!productFound) return [null , "producto no encontrado"];
    return [productFound, null];

  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return[null, "error interno del servidor "];
  }
}

export async function getProductsService() {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    if (!products || products.length === 0) return [null, "no hay productos "];
    return[products, null];
  } catch (error) {
    console.error("error al obtener los productos", error);
    return[null, "error interno del servidor"];
  }
}

export async function updateProductService(query, body) {
  try {
    const { codigoIdentificador } = query;
    const productRepository = AppDataSource.getRepository(Product);

    if (!codigoIdentificador) {
      return [null, "El código identificador es requerido para actualizar el producto"];
    }

    const productFound = await productRepository.findOne({
      where: { codigoIdentificador },
    });

    if (!productFound) {
      return [null, "Producto no encontrado"];
    }

    if (body.codigoIdentificador && body.codigoIdentificador !== codigoIdentificador) {
      return [null, "No se permite cambiar el código identificador"];
    }

    const dataProductUpdate = {
      nombreProducto: body.nombreProducto || productFound.nombreProducto,
      cantidadProducto: body.cantidadProducto || productFound.cantidadProducto,
      fechaDeCaducidad: body.fechaDeCaducidad || productFound.fechaDeCaducidad,
      tipoDeProducto: body.tipoDeProducto || productFound.tipoDeProducto,
      stockUnit: body.stockUnit || productFound.stockUnit,
      minThreshold: body.minThreshold || productFound.minThreshold,
      supplierId: body.supplierId !== undefined ? body.supplierId : productFound.supplierId,
      updatedAt: new Date(),
    };

    await productRepository.update({ codigoIdentificador }, dataProductUpdate);

    const updatedProduct = await productRepository.findOne({
      where: { codigoIdentificador },
    });

    return [updatedProduct, null];
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteProductService(query) {
  try {
    const { id, codigoIdentificador } = query;
    const productRepository = AppDataSource.getRepository(Product);

    const productFound = await productRepository.findOne({
      where: [{ id: id }, { codigoIdentificador: codigoIdentificador }],
    });

    if (!productFound) return [null, "Producto no encontrado"];

    const productDeleted = await productRepository.remove(productFound);

    return [productDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createProductService(productData) {
  const productRepository = AppDataSource.getRepository(Product);
  const provRepository = AppDataSource.getRepository(Prov);

  const {
    codigoIdentificador,
    nombreProducto,
    cantidadProducto,
    fechaDeCaducidad,
    tipoDeProducto,
    stockUnit,
    minThreshold,
    supplierId,
    cost // nuevo campo
  } = productData;

  // Verificar si el producto ya existe
  const existingProduct = await productRepository.findOne({
    where: { codigoIdentificador },
  });
  if (existingProduct) {
    return [null, { dataInfo: "codigoIdentificador", message: "Código identificador en uso" }];
  }

  // Verificar si existe el proveedor
  const provFound = await provRepository.findOne({ where: { id: supplierId } });
  if (!provFound) {
    return [null, "No existe un proveedor con el id proporcionado."];
  }

  // Crear la transacción de tipo expense antes de crear el producto
  const newExpenseData = [{
    amount: cost,
    description: `Compra de ${nombreProducto}`,
    source: `${tipoDeProducto}`, // puedes ajustarlo según el tipo de producto
    type: "expense"
  }];

  const [newExpense, errorNewExpense] = await addTransactionService(newExpenseData);
  if (errorNewExpense) {
    return [null, "Error al crear el gasto asociado al producto."];
  }

  // newExpense es un array, tomamos la primer transacción creada
  const expenseCreated = newExpense[0];

  const newProduct = productRepository.create({
    codigoIdentificador,
    nombreProducto,
    cantidadProducto,
    fechaDeCaducidad,
    tipoDeProducto,
    stockUnit,
    minThreshold,
    supplierId,
    expenseId: expenseCreated.id, // Vincular el producto con el expense recién creado
  });

  await productRepository.save(newProduct);

  return [newProduct, null];
}

// Obtener productos críticos
export async function getCriticalProductsService() {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const provRepository = AppDataSource.getRepository(Prov);

    // Obtenemos todos los productos
    const products = await productRepository.find();

    // Si no hay productos
    if (!products || products.length === 0) return [[], null];

    // Filtrar los productos críticos
    const critical = products.filter(p => p.cantidadProducto < p.minThreshold);

    if (critical.length === 0) {
      // Si no hay productos críticos, devolvemos la lista vacía
      return [[], null];
    }

    // Obtener todos los proveedores para mapear por ID
    const provs = await provRepository.find();
    const provMap = {};
    provs.forEach(prov => {
      provMap[prov.id] = prov.nombre;
    });

    // Agregamos el nombre del proveedor a cada producto crítico
    const criticalWithProvName = critical.map(prod => {
      return {
        ...prod,
        supplierName: prod.supplierId ? provMap[prod.supplierId] || "N/A" : "N/A"
      };
    });

    return [criticalWithProvName, null];
  } catch (error) {
    console.error("Error al obtener productos críticos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar stock luego de una venta
export async function updateStockService(ingredients) {
  try {
    // ingredients: [{ name, amount, unit }]
    const productRepository = AppDataSource.getRepository(Product);

    for (const ing of ingredients) {
      const productFound = await productRepository.findOne({
        where: { nombreProducto: ing.name }
      });
      if (productFound) {
        // Descontar la cantidad
        const newAmount = productFound.cantidadProducto - ing.amount;
        if (newAmount < 0) {
          return [null, `Stock insuficiente para ${ing.name}`];
        }
        productFound.cantidadProducto = newAmount;
        productFound.updatedAt = new Date();
        await productRepository.save(productFound);
      } else {
        // Si no existe el producto en inventario
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
          // Si no hay stock suficiente para una sola unidad
          maxQuantity = 0;
          break;
        } else {
          // Calcular cuántas unidades se podrían hacer según este ingrediente
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

