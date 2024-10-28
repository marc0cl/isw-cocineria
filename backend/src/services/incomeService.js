"use strict";
import Income from "../entity/incomeEntity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getIncomeService(query) {
  try {
    const { id, source } = query;
    const incomeRepository = AppDataSource.getRepository(Income);
    const incomeFound = await incomeRepository.findOne({
      where: [{ id: id }, { source: source }],
    });

    if (!incomeFound) return [null, "Ingreso no encontrado"];

    return [incomeFound, null];
  } catch (error) {
    console.error("Error al obtener el ingreso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getIncomesService() {
  try {
    const incomeRepository = AppDataSource.getRepository(Income);
    const incomes = await incomeRepository.find();

    if (!incomes || incomes.length === 0) return [null, "No hay ingresos registrados"];

    return [incomes, null];
  } catch (error) {
    console.error("Error al obtener los ingresos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function addIncomeService(body) {
  try {
    const incomeRepository = AppDataSource.getRepository(Income);
    const newIncome = incomeRepository.create(body);
    await incomeRepository.save(newIncome);

    return [newIncome, null];
  } catch (error) {
    console.error("Error al agregar el ingreso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateIncomeService(query, body) {
  try {
    const { id } = query;
    const incomeRepository = AppDataSource.getRepository(Income);
    const incomeFound = await incomeRepository.findOne({ where: { id: id } });

    if (!incomeFound) return [null, "Ingreso no encontrado"];

    await incomeRepository.update({ id: incomeFound.id }, body);
    const updatedIncome = await incomeRepository.findOne({ where: { id: incomeFound.id } });

    return [updatedIncome, null];
  } catch (error) {
    console.error("Error al actualizar el ingreso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteIncomeService(query) {
  try {
    const { id } = query;
    const incomeRepository = AppDataSource.getRepository(Income);
    const incomeFound = await incomeRepository.findOne({ where: { id: id } });

    if (!incomeFound) return [null, "Ingreso no encontrado"];

    await incomeRepository.remove(incomeFound);

    return [incomeFound, null];
  } catch (error) {
    console.error("Error al eliminar el ingreso:", error);
    return [null, "Error interno del servidor"];
  }
}
