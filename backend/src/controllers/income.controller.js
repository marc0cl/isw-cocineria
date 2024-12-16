"use strict";
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

    // Agrupar productos solicitados
    const productCount = data.reduce((acc, prod) => {
      acc[prod.description] = (acc[prod.description] || 0) + 1;
      return acc;
    }, {});

    // Validar con stock
    const insufficientProducts = [];
    for (const [productName, requestedQty] of Object.entries(productCount)) {
      const productInStock = menuData.menu.on_stock.find(item => item.name === productName);

      // Si no existe el producto en on_stock o su cantidad es menor a la solicitada
      if (!productInStock || productInStock.amount < requestedQty) {
        insufficientProducts.push({
          product: productName,
          requested: requestedQty,
          available: productInStock ? productInStock.amount : 0
        });
      }
    }

    if (insufficientProducts.length > 0) {
      // Retorna un arreglo con los productos que no se pueden surtir totalmente
      return res.status(200).send(insufficientProducts);
    }

    // Si no hay insuficientes, proceder con la creación del ingreso
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
