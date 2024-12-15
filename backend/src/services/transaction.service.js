"use strict";
import Transaction from "../entity/transaction.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getTransactionService(query) {
  try {
    const { id, source, type } = query;
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const whereClause = {};
    if (id) whereClause.id = id;
    if (source) whereClause.source = source;
    if (type) whereClause.type = type;

    const transactionFound = await transactionRepository.findOne({ where: whereClause });

    if (!transactionFound) return [null, "Transacción no encontrada"];

    return [transactionFound, null];
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTransactionsService(query = {}) {
  try {
    const { from, to, type } = query;
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const queryBuilder = transactionRepository.createQueryBuilder("transaction");

    if (type) {
      queryBuilder.where("transaction.type = :type", { type });
    }

    const fromDate = from ? new Date(`${from}T00:00:00Z`) : null;
    const toDate = to ? new Date(`${to}T23:59:59Z`) : null;

    if (fromDate) {
      queryBuilder.andWhere("transaction.updatedAt >= :fromDate", { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere("transaction.updatedAt <= :toDate", { toDate });
    }

    const transactions = await queryBuilder.getMany();

    if (!transactions || transactions.length === 0)
      return [null, "No hay transacciones registradas"];

    return [transactions, null];
  } catch (error) {
    console.error("Error al obtener las transacciones:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function addTransactionService(transactions) {
  try {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const newTransactions = transactionRepository.create(transactions);
    await transactionRepository.save(newTransactions);

    return [newTransactions, null];
  } catch (error) {
    console.error("Error al agregar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateTransactionService(query, body) {
  try {
    const { id } = query;
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transactionFound = await transactionRepository.findOne({ where: { id: id } });

    if (!transactionFound) return [null, "Transacción no encontrada"];

    const updatedData = {
      ...body,
      updatedAt: new Date(),
    };

    await transactionRepository.update({ id: transactionFound.id }, updatedData);
    const updatedTransaction = await transactionRepository.findOne({ where: { id: transactionFound.id } });

    return [updatedTransaction, null];
  } catch (error) {
    console.error("Error al actualizar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteTransactionService(query) {
  try {
    const { id } = query;
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transactionFound = await transactionRepository.findOne({ where: { id: id } });

    if (!transactionFound) return [null, "Transacción no encontrada"];

    await transactionRepository.remove(transactionFound);

    return [transactionFound, null];
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}
