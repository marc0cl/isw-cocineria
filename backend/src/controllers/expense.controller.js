"use strict";
import {
  addExpenseService,
  deleteExpenseService,
  getExpenseService,
  getExpensesService,
  updateExpenseService,
} from "../services/expense.service.js";
import { expenseBodyValidation, expenseQueryValidation } from "../validations/expenseValidation.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = expenseQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [expense, errorExpense] = await getExpenseService({ id });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    res.status(200).send(expense);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getExpenses(req, res) {
  try {
    const [expenses, errorExpenses] = await getExpensesService();

    if (errorExpenses) return handleErrorClient(res, 404, errorExpenses);

    res.status(200).send(expenses);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addExpense(req, res) {
  try {
    const { body } = req;
    const { error } = expenseBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorExpense] = await addExpenseService(body);

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
    const { error: queryError } = expenseQueryValidation.validate({ id });

    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = expenseBodyValidation.validate(body);

    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [, errorExpense] = await updateExpenseService({ id }, body);

    if (errorExpense) return handleErrorClient(res, 400, errorExpense);

    res.status(200).send("Gasto actualizado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = expenseQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorExpense] = await deleteExpenseService({ id });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    res.status(200).send("Gasto eliminado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
