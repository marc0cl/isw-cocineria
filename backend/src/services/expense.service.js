"use strict";
import Expense from "../entity/expense.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getExpenseService(query) {
  try {
    const { id } = query;
    const expenseRepository = AppDataSource.getRepository(Expense);
    const expenseFound = await expenseRepository.findOne({ where: { id: id } });

    if (!expenseFound) return [null, "Gasto no encontrado"];

    return [expenseFound, null];
  } catch (error) {
    console.error("Error al obtener el gasto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getExpensesService(query = {}) {
  try {
    const { from, to } = query;
    const expenseRepository = AppDataSource.getRepository(Expense);

    const queryBuilder = expenseRepository.createQueryBuilder("expense");
    const fromDate = from ? new Date(`${from}T00:00:00Z`) : null;
    const toDate = to ? new Date(`${to}T23:59:59Z`) : null;

    if (fromDate) {
      queryBuilder.andWhere("expense.updatedAt >= :fromDate", { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere("expense.updatedAt <= :toDate", { toDate });
    }

    const expenses = await queryBuilder.getMany();

    if (!expenses || expenses.length === 0) return [null, "No hay gastos registrados"];

    return [expenses, null];
  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function addExpenseService(body) {
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const newExpense = expenseRepository.create(body);
    await expenseRepository.save(newExpense);

    return [newExpense, null];
  } catch (error) {
    console.error("Error al agregar el gasto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateExpenseService(query, body) {
  try {
    const { id } = query;
    const expenseRepository = AppDataSource.getRepository(Expense);
    const expenseFound = await expenseRepository.findOne({ where: { id: id } });

    if (!expenseFound) return [null, "Gasto no encontrado"];

    const updatedData = {
      ...body,
      updatedAt: new Date(),
    };

    await expenseRepository.update({ id: expenseFound.id }, updatedData);
    const updatedExpense = await expenseRepository.findOne({ where: { id: expenseFound.id } });

    return [updatedExpense, null];
  } catch (error) {
    console.error("Error al actualizar el gasto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteExpenseService(query) {
  try {
    const { id } = query;
    const expenseRepository = AppDataSource.getRepository(Expense);
    const expenseFound = await expenseRepository.findOne({ where: { id: id } });

    if (!expenseFound) return [null, "Gasto no encontrado"];

    await expenseRepository.remove(expenseFound);

    return [expenseFound, null];
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    return [null, "Error interno del servidor"];
  }
}
