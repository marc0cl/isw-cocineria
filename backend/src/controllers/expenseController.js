"use strict";
import {
  addExpenseService,
  deleteExpenseService,
  getExpenseService,
  getExpensesService,
  updateExpenseService,
} from "../services/expenseService.js";
import { expenseBodyValidation, expenseQueryValidation } from "../validations/expenseValidation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = expenseQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [expense, errorExpense] = await getExpenseService({ id });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    handleSuccess(res, 200, "Gasto encontrado", expense);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getExpenses(req, res) {
  try {
    const [expenses, errorExpenses] = await getExpensesService();

    if (errorExpenses) return handleErrorClient(res, 404, errorExpenses);

    expenses.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Gastos encontrados", expenses);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addExpense(req, res) {
  try {
    const { body } = req;
    const { error } = expenseBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [expense, errorExpense] = await addExpenseService(body);

    if (errorExpense) return handleErrorClient(res, 400, errorExpense);

    handleSuccess(res, 201, "Gasto añadido correctamente", expense);
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

    const [expense, errorExpense] = await updateExpenseService({ id }, body);

    if (errorExpense) return handleErrorClient(res, 400, errorExpense);

    handleSuccess(res, 200, "Gasto actualizado correctamente", expense);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.query;
    const { error } = expenseQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [deletedExpense, errorExpense] = await deleteExpenseService({ id });

    if (errorExpense) return handleErrorClient(res, 404, errorExpense);

    handleSuccess(res, 200, "Gasto eliminado correctamente", deletedExpense);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
