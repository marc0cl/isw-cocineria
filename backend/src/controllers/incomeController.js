"use strict";
import {
  addIncomeService,
  deleteIncomeService,
  getIncomeService,
  getIncomesService,
  updateIncomeService,
} from "../services/incomeService.js";
import { incomeBodyValidation, incomeQueryValidation } from "../validations/incomeValidation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getIncome(req, res) {
  try {
    const { id, source } = req.query;
    const { error } = incomeQueryValidation.validate({ id, source });

    if (error) return handleErrorClient(res, 400, error.message);

    const [income, errorIncome] = await getIncomeService({ id, source });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    handleSuccess(res, 200, "Ingreso encontrado", income);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getIncomes(req, res) {
  try {
    const [incomes, errorIncomes] = await getIncomesService();

    if (errorIncomes) return handleErrorClient(res, 404, errorIncomes);

    incomes.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Ingresos encontrados", incomes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addIncome(req, res) {
  try {
    const { body } = req;
    const { error } = incomeBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [income, errorIncome] = await addIncomeService(body);

    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    handleSuccess(res, 201, "Ingreso añadido correctamente", income);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateIncome(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;
    const { error: queryError } = incomeQueryValidation.validate({ id });

    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = incomeBodyValidation.validate(body);

    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [income, errorIncome] = await updateIncomeService({ id }, body);

    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    handleSuccess(res, 200, "Ingreso actualizado correctamente", income);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteIncome(req, res) {
  try {
    const { id } = req.query;
    const { error } = incomeQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [deletedIncome, errorIncome] = await deleteIncomeService({ id });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    handleSuccess(res, 200, "Ingreso eliminado correctamente", deletedIncome);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
