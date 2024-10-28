"use strict";
import {
  addIncomeService,
  deleteIncomeService,
  getIncomeService,
  getIncomesService,
  updateIncomeService,
} from "../services/income.service.js";
import { incomeBodyValidation, incomeQueryValidation } from "../validations/incomeValidation.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getIncome(req, res) {
  try {
    const { id, source } = req.query;
    const { error } = incomeQueryValidation.validate({ id, source });

    if (error) return handleErrorClient(res, 400, error.message);

    const [income, errorIncome] = await getIncomeService({ id, source });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    // Devuelve solo el body de la data
    res.status(200).send(income);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getIncomes(req, res) {
  try {
    const [incomes, errorIncomes] = await getIncomesService();

    if (errorIncomes) return handleErrorClient(res, 404, errorIncomes);

    res.status(200).send(incomes); // Devuelve solo el body de la data
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function addIncome(req, res) {
  try {
    const { body } = req;
    const { error } = incomeBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorIncome] = await addIncomeService(body);

    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(201).send("Ingreso añadido correctamente"); // Solo mensaje
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

    const [, errorIncome] = await updateIncomeService({ id }, body);

    if (errorIncome) return handleErrorClient(res, 400, errorIncome);

    res.status(200).send("Ingreso actualizado correctamente"); // Solo mensaje
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteIncome(req, res) {
  try {
    const { id } = req.query;
    const { error } = incomeQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [, errorIncome] = await deleteIncomeService({ id });

    if (errorIncome) return handleErrorClient(res, 404, errorIncome);

    res.status(200).send("Ingreso eliminado correctamente"); // Solo mensaje
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
