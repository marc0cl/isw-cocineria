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

export async function getExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = transactionQueryValidation.validate({ id, type: "expense" });

    if (error) return handleErrorClient(res, 400, error.message);

    const [expense, errorExpense] = await getTransactionService({ id, type: "expense" });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    res.status(200).send(expense);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getExpenses(req, res) {
  try {
    const { from, to } = req.query;
    const [expenses, errorExpenses] = await getTransactionsService({ from, to, type: "expense" });

    if (errorExpenses) return handleErrorClient(res, 404, errorExpenses);

    res.status(200).send(expenses);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addExpense(req, res) {
  try {
    const { body } = req;
    const data = { ...body, type: "expense" };
    const { error } = transactionBodyValidation.validate(data);

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorExpense] = await addTransactionService(data);

    if (errorExpense) return handleErrorClient(res, 400, errorExpense);

    res.status(201).send("Gasto añadido correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;
    const data = { ...body, type: "expense" };
    const { error: queryError } = transactionQueryValidation.validate({ id });

    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = transactionBodyValidation.validate(data);

    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [, errorExpense] = await updateTransactionService({ id }, data);

    if (errorExpense) return handleErrorClient(res, 400, errorExpense);

    res.status(200).send("Gasto actualizado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = transactionQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorExpense] = await deleteTransactionService({ id });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    res.status(200).send("Gasto eliminado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
