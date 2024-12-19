"use strict";
import { AppDataSource } from "../config/configDb.js";
import Product from "../entity/product.entity.js";
import {
  addTransactionService,
  deleteTransactionService,
  getTransactionService,
  getTransactionsService,
  updateTransactionService,
} from "../services/transaction.service.js";
import {
  transactionBodyValidation,
  transactionQueryValidation,
} from "../validations/transaction.validation.js";
import { getFinalMenuService } from "../services/menu.service.js"
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { transactionsArrayValidation } from "../validations/transaction.validation.js";
import { MenuLoader } from "../utils/MenuLoader.js";

export async function getIncome(req, res) {
  try {
    const { id, source } = req.query;
    const { error } = transactionQueryValidation.validate({ id, source, type: "income" });

    if (error) return handleErrorClient(res, 400, error.message);

    const [income, errorIncome] = await getTransactionService({ id, source, type: "income" });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    res.status(200).send(income);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getIncomes(req, res) {
  try {
    const { from, to } = req.query;
    const [incomes, errorIncomes] = await getTransactionsService({ from, to, type: "income" });

    if (errorIncomes) return handleErrorClient(res, 404, errorIncomes);

    res.status(200).send(incomes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addMultipleIncomes(req, res) {
  try {
    const { body } = req;
    const data = body.map(item => ({ ...item, type: "income" }));

    const { error } = transactionsArrayValidation.validate(data);
    if (error) return handleErrorClient(res, 400, error.message);

    const [menuData, errorMenu] = await getFinalMenuService();
    if (errorMenu) return handleErrorClient(res, 500, errorMenu);

    const productCount = data.reduce((acc, prod) => {
      acc[prod.description] = (acc[prod.description] || 0) + 1;
      return acc;
    }, {});

    const insufficientProducts = [];
    for (const [productName, requestedQty] of Object.entries(productCount)) {
      const productInStock = menuData.menu.on_stock.find(item => item.name === productName);

      if (!productInStock || productInStock.amount < requestedQty) {
        insufficientProducts.push({
          product: productName,
          requested: requestedQty,
          available: productInStock ? productInStock.amount : 0
        });
      }
    }

    if (insufficientProducts.length > 0) {
      return res.status(200).send(insufficientProducts);
    }

    const productRepository = AppDataSource.getRepository(Product);
    for (const [productName, requestedQty] of Object.entries(productCount)) {
      const menuItem = MenuLoader.menu.find(item => item.name === productName);
      if (!menuItem) {
        return handleErrorClient(res, 400, `El producto '${productName}' no se encontró en el menú original.`);
      }

      // Por cada ingrediente se descuenta del inventario
      for (const ingredient of menuItem.ingredients) {
        const ingName = ingredient.name.trim();
        const ingAmountNeededPerUnit = ingredient.amount;
        const ingUnit = ingredient.unit;
        const totalAmountNeeded = ingAmountNeededPerUnit * requestedQty;

        const dbProduct = await productRepository.findOne({ where: { nombreProducto: ingName } });
        if (!dbProduct) {
          return handleErrorClient(res, 400, `El ingrediente '${ingName}' no existe en el inventario.`);
        }

        const pesoConvertido = convertToBaseUnit(totalAmountNeeded, ingUnit, dbProduct.stockUnit);

        const newCantidad = dbProduct.cantidadProducto - pesoConvertido;
        if (newCantidad < 0) {
          return handleErrorClient(res, 400,
            `Ingrediente '${ingName}' 
            sin suficiente stock al intentar descontar (${pesoConvertido}${dbProduct.stockUnit}).`);
        }

        // Actualizar el stock del ingrediente
        await productRepository.update({ id: dbProduct.id }, {
          cantidadProducto: newCantidad,
          updatedAt: new Date()
        });
      }
    }

    // Ahora sí agregamos las transacciones
    const [, errorIncome] = await addTransactionService(data);
    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(201).send([]);
  } catch (error) {
    console.log("Error: " + error)
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateIncome(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;
    const data = { ...body, type: "income" };
    const { error: queryError } = transactionQueryValidation.validate({ id });

    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = transactionBodyValidation.validate(data);

    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [, errorIncome] = await updateTransactionService({ id }, data);

    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(200).send("Ingreso actualizado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteIncome(req, res) {
  try {
    const { id } = req.query;
    const { error } = transactionQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorIncome] = await deleteTransactionService({ id });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    res.status(200).send("Ingreso eliminado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

function convertToBaseUnit(value, unit, targetUnit) {
  const massUnits = ["g", "kg", "mg", "t"];
  const volumeUnits = ["ml", "l"];

  if (targetUnit === "g") {
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
        throw new Error(`Unidad de masa no válida: ${unit}`);
    }
  } else if (targetUnit === "ml") {
    switch (unit) {
      case "ml":
        return value;
      case "l":
        return value * 1000;
      default:
        throw new Error(`Unidad de volumen no válida: ${unit}`);
    }
  } else {
    throw new Error(`Unidad de destino no válida: ${targetUnit}`);
  }
}
