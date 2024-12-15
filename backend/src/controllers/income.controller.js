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

export async function addIncome(req, res) {
  try {
    const { body } = req;
    const data = { ...body, type: "income" };

    const { error } = transactionsArrayValidation.validate([data]);

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorIncome] = await addTransactionService([data]);
    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(201).send("Ingreso añadido correctamente");
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

    const [, errorIncome] = await addTransactionService(data);
    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(201).send("Ingresos añadidos correctamente");
  } catch (error) {
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
